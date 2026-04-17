---
title: "Clean Architecture in .NET Core: A Practical Guide"
date: "2026-04-16"
tags: ["Back End", ".NET", "Architecture"]
excerpt: "How to structure a .NET Core solution using Clean Architecture — separating Domain, Application, Infrastructure, and Presentation layers with real-world examples."
---

# Clean Architecture in .NET Core: A Practical Guide

After maintaining large-scale ERP systems for 16+ years, one pattern has consistently proven itself: **Clean Architecture**. Here's how I apply it in .NET Core projects.

## What Is Clean Architecture?

Clean Architecture enforces a strict dependency rule: **inner layers must never depend on outer layers**.

```
Presentation  ──►  Application  ──►  Domain
Infrastructure ──►  Application
```

The **Domain** layer is the heart — pure C# with no framework dependencies whatsoever.

## Solution Structure

```
MyApp.sln
├── MyApp.Domain           // Entities, Value Objects, Interfaces
├── MyApp.Application      // Use Cases, DTOs, Validators
├── MyApp.Infrastructure   // EF Core, Repositories, External Services
└── MyApp.API              // ASP.NET Core Controllers, Middleware
```

## Domain Layer

Start here. No NuGet packages, no EF Core, just pure business logic:

```csharp
// MyApp.Domain/Entities/Order.cs
public class Order
{
    public Guid Id { get; private set; }
    public CustomerId CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    private readonly List<OrderLine> _lines = new();
    public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();

    private Order() { } // EF Core needs this

    public static Order Create(CustomerId customerId)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            CustomerId = customerId,
            Status = OrderStatus.Draft
        };
    }

    public void AddLine(ProductId productId, int quantity, Money unitPrice)
    {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Cannot modify a confirmed order.");

        _lines.Add(new OrderLine(productId, quantity, unitPrice));
    }

    public void Confirm()
    {
        if (!_lines.Any())
            throw new DomainException("Order must have at least one line.");

        Status = OrderStatus.Confirmed;
    }
}
```

Notice: no `[Required]`, no EF attributes, no HTTP concerns. Pure domain rules.

## Application Layer

Use Cases live here, orchestrating domain objects via interfaces:

```csharp
// MyApp.Application/Orders/Commands/ConfirmOrder/ConfirmOrderCommand.cs
public record ConfirmOrderCommand(Guid OrderId) : IRequest<Result>;

public class ConfirmOrderHandler : IRequestHandler<ConfirmOrderCommand, Result>
{
    private readonly IOrderRepository _orders;
    private readonly IUnitOfWork _unitOfWork;

    public ConfirmOrderHandler(IOrderRepository orders, IUnitOfWork unitOfWork)
    {
        _orders = orders;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(ConfirmOrderCommand cmd, CancellationToken ct)
    {
        var order = await _orders.GetByIdAsync(cmd.OrderId, ct);
        if (order is null)
            return Result.Failure("Order not found.");

        order.Confirm();

        await _unitOfWork.SaveChangesAsync(ct);
        return Result.Success();
    }
}
```

The Application layer knows **nothing** about SQL, HTTP, or EF Core.

## Infrastructure Layer (EF Core)

Concrete implementations of domain interfaces:

```csharp
// MyApp.Infrastructure/Persistence/Repositories/OrderRepository.cs
public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _db;

    public OrderRepository(AppDbContext db) => _db = db;

    public async Task<Order?> GetByIdAsync(Guid id, CancellationToken ct)
        => await _db.Orders
            .Include(o => o.Lines)
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public void Add(Order order) => _db.Orders.Add(order);
}
```

```csharp
// EF Core configuration kept out of the entity
public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);
        builder.Property(o => o.Status).HasConversion<string>();
        builder.OwnsMany(o => o.Lines, lines =>
        {
            lines.WithOwner();
            lines.HasKey(l => l.Id);
        });
    }
}
```

## API Layer (Controller)

Thin controllers — just translate HTTP to commands:

```csharp
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly ISender _mediator;

    public OrdersController(ISender mediator) => _mediator = mediator;

    [HttpPost("{id}/confirm")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var result = await _mediator.Send(new ConfirmOrderCommand(id));
        return result.IsSuccess ? NoContent() : BadRequest(result.Error);
    }
}
```

## Dependency Injection Wiring

```csharp
// Program.cs
builder.Services
    .AddApplication()       // MediatR, FluentValidation
    .AddInfrastructure()    // EF Core, Repositories
    .AddPersistence(builder.Configuration);
```

## Key Benefits I've Seen in Production

1. **Testability** — Application layer tested without a database in milliseconds
2. **Database independence** — swapped MSSQL for PostgreSQL in one project without touching domain logic
3. **Onboarding speed** — new developers understand where to put code immediately
4. **Long-term maintainability** — 5-year-old modules still easy to change

Clean Architecture adds some upfront complexity, but in enterprise ERP systems it pays for itself within months.
