---
title: "CQRS in .NET with MediatR: A Production Walkthrough"
date: "2026-04-15"
tags: ["Back End", ".NET", "Architecture"]
excerpt: "A practical guide to implementing CQRS (Command Query Responsibility Segregation) in ASP.NET Core using MediatR — with real command/query examples, pipeline behaviors, and lessons from enterprise ERP systems."
---

# CQRS in .NET with MediatR: A Production Walkthrough

CQRS — **Command Query Responsibility Segregation** — is one of those patterns that sounds academic until you've worked on a system where reads and writes have completely different performance characteristics, validation rules, and team ownership.

In enterprise ERP systems (payroll, accounting, inventory), I've found CQRS indispensable. Here's how I implement it in .NET with MediatR.

## The Core Idea

Split every operation into exactly two categories:

- **Commands** — change state. Return nothing (or just an ID). Examples: `CreateInvoice`, `ApproveLeaveRequest`, `ProcessPayroll`
- **Queries** — read state. Never change anything. Examples: `GetInvoiceById`, `ListEmployeesByDepartment`, `GetPayrollSummary`

```
HTTP Request
    │
    ▼
Controller ──► IMediator.Send(command/query)
                    │
                    ▼
              MediatR Pipeline
                    │
          ┌─────────┴──────────┐
          ▼                    ▼
    CommandHandler        QueryHandler
    (writes to DB)        (reads from DB)
```

## Project Structure

I organise by feature, not by type:

```
src/Application/
├── Invoices/
│   ├── Commands/
│   │   ├── CreateInvoice/
│   │   │   ├── CreateInvoiceCommand.cs
│   │   │   ├── CreateInvoiceHandler.cs
│   │   │   └── CreateInvoiceValidator.cs
│   │   └── ApproveInvoice/
│   │       ├── ApproveInvoiceCommand.cs
│   │       └── ApproveInvoiceHandler.cs
│   └── Queries/
│       ├── GetInvoiceById/
│       │   ├── GetInvoiceByIdQuery.cs
│       │   ├── GetInvoiceByIdHandler.cs
│       │   └── InvoiceDto.cs
│       └── ListInvoices/
│           ├── ListInvoicesQuery.cs
│           └── ListInvoicesHandler.cs
└── Common/
    └── Behaviors/
        ├── ValidationBehavior.cs
        ├── LoggingBehavior.cs
        └── PerformanceBehavior.cs
```

## Commands

Commands express **intent**. Name them after business actions, not CRUD operations:

```csharp
// ✅ Business intent
public record CreateInvoiceCommand(
    Guid CustomerId,
    List<InvoiceLineDto> Lines,
    DateOnly DueDate
) : IRequest<Result<Guid>>;

// ❌ CRUD thinking — avoid this
public record AddInvoiceCommand(...) : IRequest<Guid>;
```

### Command Handler

```csharp
public class CreateInvoiceHandler : IRequestHandler<CreateInvoiceCommand, Result<Guid>>
{
    private readonly IInvoiceRepository _invoices;
    private readonly ICustomerRepository _customers;
    private readonly IUnitOfWork _unitOfWork;

    public CreateInvoiceHandler(
        IInvoiceRepository invoices,
        ICustomerRepository customers,
        IUnitOfWork unitOfWork)
    {
        _invoices = invoices;
        _customers = customers;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<Guid>> Handle(
        CreateInvoiceCommand cmd, CancellationToken ct)
    {
        var customer = await _customers.GetByIdAsync(cmd.CustomerId, ct);
        if (customer is null)
            return Result.Failure<Guid>("Customer not found.");

        if (!customer.IsActive)
            return Result.Failure<Guid>("Cannot invoice an inactive customer.");

        var invoice = Invoice.Create(customer.Id, cmd.DueDate);

        foreach (var line in cmd.Lines)
        {
            invoice.AddLine(line.ProductId, line.Quantity, Money.Of(line.UnitPrice));
        }

        _invoices.Add(invoice);
        await _unitOfWork.SaveChangesAsync(ct);

        return Result.Success(invoice.Id);
    }
}
```

## Queries

Queries don't use repositories or domain entities — they read directly from the database, optimised for display:

```csharp
public record GetInvoiceByIdQuery(Guid InvoiceId) : IRequest<InvoiceDetailDto?>;

public class InvoiceDetailDto
{
    public Guid Id { get; init; }
    public string CustomerName { get; init; } = default!;
    public string CustomerEmail { get; init; } = default!;
    public DateOnly DueDate { get; init; }
    public string Status { get; init; } = default!;
    public List<InvoiceLineDto> Lines { get; init; } = [];
    public decimal TotalAmount { get; init; }
}
```

```csharp
public class GetInvoiceByIdHandler : IRequestHandler<GetInvoiceByIdQuery, InvoiceDetailDto?>
{
    private readonly AppDbContext _db;

    public GetInvoiceByIdHandler(AppDbContext db) => _db = db;

    public async Task<InvoiceDetailDto?> Handle(
        GetInvoiceByIdQuery query, CancellationToken ct)
    {
        // Direct EF Core projection — no domain entity involved
        return await _db.Invoices
            .Where(i => i.Id == query.InvoiceId)
            .Select(i => new InvoiceDetailDto
            {
                Id = i.Id,
                CustomerName = i.Customer.FullName,
                CustomerEmail = i.Customer.Email,
                DueDate = i.DueDate,
                Status = i.Status.ToString(),
                TotalAmount = i.Lines.Sum(l => l.Quantity * l.UnitPrice),
                Lines = i.Lines.Select(l => new InvoiceLineDto
                {
                    ProductName = l.Product.Name,
                    Quantity = l.Quantity,
                    UnitPrice = l.UnitPrice
                }).ToList()
            })
            .FirstOrDefaultAsync(ct);
    }
}
```

Notice: queries project directly to DTOs. No loading the full aggregate and mapping it — this generates an efficient SQL SELECT with only the columns you need.

## Pipeline Behaviors

This is where MediatR really shines. Behaviors wrap every command/query like middleware:

### Validation Behavior

```csharp
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var failures = _validators
            .Select(v => v.Validate(new ValidationContext<TRequest>(request)))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
            throw new ValidationException(failures);

        return await next();
    }
}
```

### Performance Monitoring Behavior

Flag slow operations automatically in production:

```csharp
public class PerformanceBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<TRequest> _logger;
    private readonly Stopwatch _timer = new();

    private const int SlowRequestThresholdMs = 500;

    public PerformanceBehavior(ILogger<TRequest> logger) => _logger = logger;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        _timer.Start();
        var response = await next();
        _timer.Stop();

        var elapsed = _timer.ElapsedMilliseconds;
        if (elapsed > SlowRequestThresholdMs)
        {
            _logger.LogWarning(
                "Slow request detected: {RequestName} ({Elapsed}ms) {@Request}",
                typeof(TRequest).Name, elapsed, request);
        }

        return response;
    }
}
```

### Logging Behavior

```csharp
public class LoggingBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly ILogger<TRequest> _logger;

    public LoggingBehavior(ILogger<TRequest> logger) => _logger = logger;

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken ct)
    {
        _logger.LogInformation("Handling {RequestName}", typeof(TRequest).Name);
        var response = await next();
        _logger.LogInformation("Handled {RequestName}", typeof(TRequest).Name);
        return response;
    }
}
```

## Wiring It Up

```csharp
// Program.cs
builder.Services.AddMediatR(cfg =>
{
    cfg.RegisterServicesFromAssembly(typeof(ApplicationAssemblyMarker).Assembly);

    // Pipeline order matters — runs top to bottom
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(LoggingBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(PerformanceBehavior<,>));
    cfg.AddBehavior(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
});

builder.Services.AddValidatorsFromAssembly(
    typeof(ApplicationAssemblyMarker).Assembly);
```

## Controller — As Thin As It Gets

```csharp
[ApiController]
[Route("api/invoices")]
public class InvoicesController : ControllerBase
{
    private readonly ISender _mediator;
    public InvoicesController(ISender mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Create(CreateInvoiceCommand cmd)
    {
        var result = await _mediator.Send(cmd);
        return result.IsSuccess
            ? CreatedAtAction(nameof(GetById), new { id = result.Value }, null)
            : BadRequest(result.Error);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<InvoiceDetailDto>> GetById(Guid id)
    {
        var invoice = await _mediator.Send(new GetInvoiceByIdQuery(id));
        return invoice is null ? NotFound() : Ok(invoice);
    }
}
```

## When to Use CQRS (and When Not To)

**Use it when:**
- Business logic for writes is complex (domain rules, invariants)
- Reads are high-frequency and can be optimised independently (different DB read replicas, caching)
- Multiple teams own different slices of the system
- You need an audit trail or event sourcing later

**Skip it when:**
- Simple CRUD with minimal business logic
- Small projects or prototypes
- The team isn't familiar with the pattern yet — a poorly applied CQRS is worse than no CQRS

After applying CQRS across payroll, inventory, and accounting modules in the same ERP codebase, the pattern has dramatically reduced cross-team interference. A team working on invoice queries can work without touching anything the invoice command team owns.
