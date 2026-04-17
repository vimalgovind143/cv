---
title: "Building Multi-Tenant ERP Systems in .NET Core"
date: "2026-04-18"
tags: [".NET", "ERP", "Architecture", "SaaS"]
excerpt: "Practical patterns for building multi-tenant enterprise systems—tenant isolation strategies, data partitioning, and compliance considerations from real production experience."
---

# Building Multi-Tenant ERP Systems in .NET Core

After architecting ERP systems serving multiple companies across the Middle East, I've learned that multi-tenancy isn't just a technical challenge—it's a business requirement.

This post covers the patterns we use for tenant isolation, data partitioning, and compliance in .NET Core ERP systems.

## What is Multi-Tenancy?

A **multi-tenant** system serves multiple customers (tenants) from a single application instance while keeping their data logically or physically separated.

For ERP systems, this is critical because:
- Each company needs data isolation
- Compliance requirements vary by region
- Cost efficiency matters for smaller tenants

## Tenant Isolation Strategies

### Strategy 1: Database-per-Tenant

Each tenant gets their own database.

```csharp
public class TenantDbContext : DbContext
{
    private readonly string _tenantId;
    private readonly string _connectionString;

    public TenantDbContext(string tenantId, string baseConnectionString)
    {
        _tenantId = tenantId;
        _connectionString = $"{baseConnectionString};Database=Tenant_{tenantId}";
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer(_connectionString);
    }
}
```

**Pros:**
- Maximum isolation
- Easy backup/restore per tenant
- Can customize schema per tenant
- Compliance-friendly (data residency)

**Cons:**
- Higher infrastructure cost
- More complex deployments
- Slower cross-tenant reporting

**Best for:** Enterprise tenants, regulated industries, custom deployments

### Strategy 2: Schema-per-Tenant

Each tenant gets their own schema within a shared database.

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    // Apply tenant schema
    foreach (var entity in modelBuilder.Model.GetEntityTypes())
    {
        var tableName = entity.GetTableName();
        if (tableName.StartsWith("Tenant")) return;
        
        entity.SetTableName($"Tenant_{_tenantId}.{tableName}");
    }
}
```

**Pros:**
- Good isolation
- Shared infrastructure cost
- Easier cross-tenant queries than DB-per-tenant

**Cons:**
- Schema changes affect all tenants
- Backup/restore more complex
- Some databases limit schema count

**Best for:** Mid-market SaaS, moderate customization needs

### Strategy 3: Discriminator Column (Row-Level Isolation)

All tenants share tables; a `TenantId` column separates data.

```csharp
public interface ITenantEntity
{
    string TenantId { get; set; }
}

public class Employee : ITenantEntity
{
    public int Id { get; set; }
    public string TenantId { get; set; }
    public string Name { get; set; }
    // ...
}

// Global query filter
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    foreach (var entityType in modelBuilder.Model.GetEntityTypes()
        .Where(t => typeof(ITenantEntity).IsAssignableFrom(t.ClrType)))
    {
        modelBuilder.Entity(entityType.ClrType)
            .HasQueryFilter(CreateTenantFilter(entityType.ClrType));
    }
}

private LambdaExpression CreateTenantFilter(Type entityType)
{
    var parameter = Expression.Parameter(entityType, "e");
    var property = Expression.Property(parameter, nameof(ITenantEntity.TenantId));
    var constant = Expression.Constant(_tenantId);
    var equality = Expression.Equal(property, constant);
    return Expression.Lambda(equality, parameter);
}
```

**Pros:**
- Lowest infrastructure cost
- Simple deployments
- Easy cross-tenant analytics

**Cons:**
- Risk of data leakage if filters fail
- Harder to comply with data residency laws
- Performance degrades with scale

**Best for:** SMB SaaS, cost-sensitive deployments, analytics-heavy systems

## Our Hybrid Approach

For our ERP, we use a **hybrid model**:

```
┌─────────────────────────────────────────────────┐
│              Application Layer                  │
│         (Tenant Resolution Middleware)          │
└─────────────────────────────────────────────────┘
                      │
         ┌────────────┼────────────┐
         │            │            │
         ↓            ↓            ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Enterprise │ │   Standard  │ │    Basic    │
│   Tenants   │ │   Tenants   │ │   Tenants   │
│             │ │             │ │             │
│ DB-per-     │ │ Schema-per- │ │ Discriminator│
│ Tenant      │ │ Tenant      │ │ Column      │
└─────────────┘ └─────────────┘ └─────────────┘
```

- **Enterprise**: Dedicated database (compliance, customization)
- **Standard**: Shared schema (balanced cost/isolation)
- **Basic**: Discriminator column (cost-optimized)

## Tenant Resolution

How do we know which tenant is making the request?

### Method 1: Subdomain

```csharp
public class TenantResolutionMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context, ITenantService tenantService)
    {
        var host = context.Request.Host.Host;
        var tenantId = host.Split('.').First(); // acme.app.com → "acme"
        
        var tenant = await tenantService.GetTenantAsync(tenantId);
        context.Items["Tenant"] = tenant;
        
        await _next(context);
    }
}
```

### Method 2: Header

```csharp
var tenantId = context.Request.Headers["X-Tenant-ID"].FirstOrDefault();
```

### Method 3: JWT Claim

```csharp
var tenantId = User.FindFirst("tenant_id")?.Value;
```

We use **subdomain + JWT claim** for defense in depth.

## Connection String Management

```csharp
public class TenantConnectionFactory
{
    private readonly Dictionary<string, string> _tenantConnections;
    private readonly string _defaultConnectionString;

    public string GetConnectionString(string tenantId, TenantTier tier)
    {
        return tier switch
        {
            TenantTier.Enterprise => GetEnterpriseConnection(tenantId),
            TenantTier.Standard => GetStandardConnection(tenantId),
            TenantTier.Basic => _defaultConnectionString,
            _ => throw new ArgumentException("Unknown tier")
        };
    }

    private string GetEnterpriseConnection(string tenantId)
    {
        var builder = new SqlConnectionStringBuilder(_defaultConnectionString)
        {
            InitialCatalog = $"ERP_{tenantId}"
        };
        return builder.ConnectionString;
    }
}
```

## Cross-Tenant Operations

Sometimes you need to query across tenants (admin dashboards, analytics).

```csharp
public class CrossTenantQueryService
{
    private readonly TenantRegistry _registry;

    public async Task<TenantAnalytics> GetGlobalAnalyticsAsync()
    {
        var results = new List<TenantMetrics>();

        foreach (var tenant in await _registry.GetAllTenantsAsync())
        {
            using var scope = _tenantScope.CreateScope(tenant.Id);
            var metrics = await _metricsService.GetCurrentMetricsAsync();
            results.Add(new TenantMetrics { TenantId = tenant.Id, Metrics = metrics });
        }

        return AggregateResults(results);
    }
}
```

## Compliance Considerations

### Data Residency

Some countries require data to stay within borders:

```csharp
public class DataResidencyService
{
    public string GetDatabaseLocation(string tenantId, string country)
    {
        return country switch
        {
            "BH" => "sql-bahrain.internal",
            "AE" => "sql-dubai.internal",
            "SA" => "sql-riyadh.internal",
            _ => "sql-default.internal"
        };
    }
}
```

### Audit Logging

Every tenant action must be auditable:

```csharp
public class AuditInterceptor : DbCommandInterceptor
{
    private readonly IAuditLogService _auditService;
    private readonly string _tenantId;

    public override async ValueTask<InterceptionResult<int>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        CancellationToken cancellationToken = default)
    {
        await _auditService.LogAsync(
            _tenantId,
            command.CommandText,
            command.Parameters.ToString());
        
        return await base.ReaderExecutingAsync(command, eventData, cancellationToken);
    }
}
```

## Performance Optimization

### Connection Pooling

```csharp
// Enable connection pooling in connection string
"Pooling=true;Min Pool Size=10;Max Pool Size=100;"
```

### Query Optimization

```csharp
// Always filter by tenant first
var employees = context.Employees
    .Where(e => e.TenantId == _tenantId)  // Filter first
    .Where(e => e.Department == "IT")      // Then other filters
    .ToList();
```

### Caching

```csharp
public class TenantCache
{
    private readonly IMemoryCache _cache;

    public string GetCacheKey(string tenantId, string key)
        => $"tenant:{tenantId}:{key}";

    public T Get<T>(string tenantId, string key)
    {
        var cacheKey = GetCacheKey(tenantId, key);
        return _cache.Get<T>(cacheKey);
    }
}
```

## Testing Multi-Tenant Systems

```csharp
public class MultiTenantTestBase
{
    protected TenantScope CreateTenantScope(string tenantId)
    {
        return new TenantScope(tenantId);
    }
}

public class PayrollTests : MultiTenantTestBase
{
    [Fact]
    public void Payroll_CalculatesCorrectly_ForTenantA()
    {
        using var scope = CreateTenantScope("tenant-a");
        // Test tenant A's payroll
    }

    [Fact]
    public void Payroll_CalculatesCorrectly_ForTenantB()
    {
        using var scope = CreateTenantScope("tenant-b");
        // Test tenant B's payroll
    }

    [Fact]
    public void Payroll_Data_Is_Isolated_Between_Tenants()
    {
        using (var scopeA = CreateTenantScope("tenant-a"))
        {
            // Create employee in tenant A
        }

        using (var scopeB = CreateTenantScope("tenant-b"))
        {
            // Verify employee not visible in tenant B
        }
    }
}
```

## Key Takeaways

1. **Choose isolation strategy based on business needs**, not technical preferences
2. **Hybrid approaches work well** for diverse tenant bases
3. **Tenant resolution should be early** in the request pipeline
4. **Audit everything** for compliance
5. **Test isolation rigorously**—data leakage is catastrophic

---

*Building multi-tenant systems? I'd love to hear your approach. Find me on [LinkedIn](https://linkedin.com/in/vimalgovind/) or [GitHub](https://github.com/vimalgovind143).*
