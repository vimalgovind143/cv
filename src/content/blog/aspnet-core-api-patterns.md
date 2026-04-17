---
title: "Building Robust REST APIs with ASP.NET Core: Patterns I Use Daily"
date: "2026-04-12"
tags: ["Back End", ".NET", "API"]
excerpt: "Practical patterns for building production-grade ASP.NET Core REST APIs — global error handling, validation pipelines, response envelopes, versioning, and more."
---

# Building Robust REST APIs with ASP.NET Core: Patterns I Use Daily

After building dozens of REST APIs for enterprise ERP systems in ASP.NET Core, I've converged on a consistent set of patterns. Here's my production playbook.

## 1. Global Exception Handling with Problem Details

Forget try/catch in every controller. Use a single middleware with RFC 7807 Problem Details:

```csharp
// Program.cs
app.UseExceptionHandler(exceptionHandlerApp =>
{
    exceptionHandlerApp.Run(async context =>
    {
        context.Response.ContentType = "application/problem+json";

        var exceptionHandlerFeature = context.Features.Get<IExceptionHandlerFeature>();
        var exception = exceptionHandlerFeature?.Error;

        var (statusCode, title) = exception switch
        {
            NotFoundException  => (404, "Resource not found"),
            ValidationException => (400, "Validation failed"),
            UnauthorizedException => (401, "Unauthorized"),
            DomainException    => (422, "Business rule violation"),
            _                  => (500, "An unexpected error occurred")
        };

        context.Response.StatusCode = statusCode;

        await context.Response.WriteAsJsonAsync(new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception?.Message,
            Instance = context.Request.Path
        });
    });
});
```

Now all exceptions are handled consistently across all endpoints.

## 2. Validation Pipeline with FluentValidation + MediatR

Add a validation behavior so every command is validated before the handler runs:

```csharp
// Application/Common/Behaviors/ValidationBehavior.cs
public class ValidationBehavior<TRequest, TResponse>
    : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        => _validators = validators;

    public async Task<TResponse> Handle(
        TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (!_validators.Any()) return await next();

        var context = new ValidationContext<TRequest>(request);
        var failures = _validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(f => f != null)
            .ToList();

        if (failures.Any())
            throw new ValidationException(failures);

        return await next();
    }
}
```

```csharp
// Validator for a command
public class CreateInvoiceCommandValidator : AbstractValidator<CreateInvoiceCommand>
{
    public CreateInvoiceCommandValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Lines).NotEmpty().WithMessage("Invoice must have at least one line.");
        RuleForEach(x => x.Lines).ChildRules(line =>
        {
            line.RuleFor(l => l.Quantity).GreaterThan(0);
            line.RuleFor(l => l.UnitPrice).GreaterThan(0);
        });
    }
}
```

## 3. Consistent API Response Envelope

All responses follow the same shape — consumers can always rely on it:

```csharp
public record ApiResponse<T>(
    bool Success,
    T? Data,
    string? Error,
    IEnumerable<string>? ValidationErrors = null)
{
    public static ApiResponse<T> Ok(T data) => new(true, data, null);
    public static ApiResponse<T> Fail(string error) => new(false, default, error);
}
```

```csharp
// Controller usage
[HttpGet("{id}")]
public async Task<ActionResult<ApiResponse<InvoiceDto>>> GetInvoice(Guid id)
{
    var invoice = await _mediator.Send(new GetInvoiceQuery(id));
    return invoice is null
        ? NotFound(ApiResponse<InvoiceDto>.Fail("Invoice not found"))
        : Ok(ApiResponse<InvoiceDto>.Ok(invoice));
}
```

## 4. API Versioning

I always version APIs from day one — it's far cheaper than retrofitting later:

```csharp
// Program.cs
builder.Services
    .AddApiVersioning(options =>
    {
        options.DefaultApiVersion = new ApiVersion(1, 0);
        options.AssumeDefaultVersionWhenUnspecified = true;
        options.ReportApiVersions = true;
        options.ApiVersionReader = ApiVersionReader.Combine(
            new UrlSegmentApiVersionReader(),
            new HeaderApiVersionReader("X-API-Version"));
    })
    .AddApiExplorer(options =>
    {
        options.GroupNameFormat = "'v'VVV";
        options.SubstituteApiVersionInUrl = true;
    });
```

```csharp
[ApiController]
[ApiVersion("1.0")]
[ApiVersion("2.0")]
[Route("api/v{version:apiVersion}/invoices")]
public class InvoicesController : ControllerBase
{
    [HttpGet, MapToApiVersion("1.0")]
    public async Task<IActionResult> GetV1() { /* ... */ }

    [HttpGet, MapToApiVersion("2.0")]
    public async Task<IActionResult> GetV2() { /* ... */ } // enhanced response shape
}
```

## 5. Middleware: Request Logging with Correlation IDs

Every request gets a `CorrelationId` that flows through logs, making production debugging trivial:

```csharp
public class CorrelationIdMiddleware
{
    private const string Header = "X-Correlation-ID";
    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next) => _next = next;

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = context.Request.Headers[Header].FirstOrDefault()
                            ?? Guid.NewGuid().ToString();

        context.Response.Headers[Header] = correlationId;

        using (LogContext.PushProperty("CorrelationId", correlationId))
        {
            await _next(context);
        }
    }
}
```

Now every Serilog log entry includes the CorrelationId — you can trace a single request across all log lines instantly.

## 6. Minimal APIs vs Controllers

For simple CRUD or internal services, Minimal APIs are cleaner:

```csharp
// Minimal API style (great for microservices)
app.MapGroup("/api/v1/products")
   .MapProductEndpoints()
   .RequireAuthorization()
   .WithOpenApi();

// ProductEndpoints.cs
public static class ProductEndpoints
{
    public static RouteGroupBuilder MapProductEndpoints(this RouteGroupBuilder group)
    {
        group.MapGet("/", async (ISender mediator) =>
        {
            var result = await mediator.Send(new GetProductsQuery());
            return Results.Ok(result);
        });

        group.MapPost("/", async (CreateProductCommand cmd, ISender mediator) =>
        {
            var id = await mediator.Send(cmd);
            return Results.CreatedAtRoute("GetProduct", new { id });
        });

        return group;
    }
}
```

## 7. Health Checks

Always add health checks — especially for Kubernetes liveness/readiness probes:

```csharp
builder.Services
    .AddHealthChecks()
    .AddSqlServer(connectionString, name: "database")
    .AddRedis(redisConnection, name: "cache")
    .AddUrlGroup(new Uri("https://external-api.com/health"), name: "external-api");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.MapHealthChecks("/health/ready",  new HealthCheckOptions
{
    Predicate = check => check.Tags.Contains("ready")
});

app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false  // always returns healthy if process is running
});
```

## The Pattern Stack I Default To

```
ASP.NET Core Web API
  ↓ MediatR (CQRS)
  ↓ FluentValidation pipeline behavior
  ↓ Global exception handler (ProblemDetails)
  ↓ Entity Framework Core + Repository pattern
  ↓ SQL Server / MSSQL
```

This combination has served me well across payroll systems, inventory platforms, and microfinance applications. Start simple, add complexity only where you need it.
