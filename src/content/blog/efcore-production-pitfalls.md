---
title: "Entity Framework Core: Pitfalls I Hit in Production (and How to Fix Them)"
date: "2026-04-13"
tags: ["Back End", ".NET", "SQL"]
excerpt: "Real EF Core mistakes I've made or seen in enterprise .NET systems — N+1 queries, cartesian explosions, tracking overhead, migration pitfalls — and the patterns that solve them."
---

# Entity Framework Core: Pitfalls I Hit in Production (and How to Fix Them)

Entity Framework Core is genuinely excellent. But it's also easy to write code that looks harmless and absolutely destroys database performance under load. Here are the real problems I've encountered in enterprise ERP systems and exactly how to fix them.

## 1. The N+1 Query Problem

This is the classic. It looks completely innocent in code:

```csharp
// ❌ N+1: 1 query for orders + 1 query per order for customer
var orders = await _db.Orders
    .Where(o => o.CompanyId == companyId)
    .ToListAsync();

foreach (var order in orders)
{
    Console.WriteLine($"{order.Customer.Name}: {order.TotalAmount}");
    // EF executes a new SELECT here for every order
}
```

If you have 500 orders, that's 501 database round trips.

```csharp
// ✅ One query with JOIN
var orders = await _db.Orders
    .Where(o => o.CompanyId == companyId)
    .Include(o => o.Customer)   // JOIN in a single query
    .ToListAsync();
```

Or better yet, project to a DTO and avoid loading entities you don't need:

```csharp
// ✅ Even better: projection, no tracking, only columns you need
var orders = await _db.Orders
    .Where(o => o.CompanyId == companyId)
    .Select(o => new OrderSummaryDto
    {
        OrderId = o.Id,
        CustomerName = o.Customer.Name,
        TotalAmount = o.TotalAmount,
        Status = o.Status.ToString()
    })
    .ToListAsync();
```

**Detection tip:** Enable sensitive logging in dev and watch the SQL output:

```csharp
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Microsoft.EntityFrameworkCore.Database.Command": "Information"
    }
  }
}
```

## 2. Cartesian Explosion with Multiple Includes

This one is subtle and I've seen it bring down production reports:

```csharp
// ❌ Generates a cartesian product: Orders × Lines × Payments
var orders = await _db.Orders
    .Include(o => o.Lines)
    .Include(o => o.Payments)
    .Where(o => o.CompanyId == companyId)
    .ToListAsync();
```

If an order has 20 lines and 5 payments, EF fetches `20 × 5 = 100` rows per order instead of 25. For a report with thousands of orders this is catastrophic.

```csharp
// ✅ Use AsSplitQuery() — EF Core 5+
var orders = await _db.Orders
    .Include(o => o.Lines)
    .Include(o => o.Payments)
    .Where(o => o.CompanyId == companyId)
    .AsSplitQuery()   // executes separate optimised queries per collection
    .ToListAsync();
```

Or configure split queries as the default:

```csharp
// DbContext configuration
optionsBuilder.UseSqlServer(connectionString, o =>
    o.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery));
```

## 3. Forgetting AsNoTracking on Read Queries

EF Core tracks every entity it loads by default — it stores a snapshot in memory to detect changes. For write operations this is necessary. For read-only queries it's pure overhead.

```csharp
// ❌ Tracked — EF stores a copy of every row in the change tracker
var employees = await _db.Employees
    .Where(e => e.DepartmentId == deptId)
    .ToListAsync();

// ✅ Untracked — faster, uses less memory
var employees = await _db.Employees
    .Where(e => e.DepartmentId == deptId)
    .AsNoTracking()
    .ToListAsync();
```

I typically configure `AsNoTrackingWithIdentityResolution()` at the DbContext level for read-only query contexts:

```csharp
// Read-only DbContext factory for query handlers
services.AddDbContextFactory<ReadOnlyAppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTrackingWithIdentityResolution);
});
```

## 4. Applying Where Filters After ToList

A common mistake that pulls the entire table into memory before filtering:

```csharp
// ❌ Loads ALL employees into memory, then filters in C#
var result = await _db.Employees
    .ToListAsync();                           // executes SQL here
var active = result.Where(e => e.IsActive);  // C# filter — too late!

// ✅ Translate filter to SQL WHERE clause
var active = await _db.Employees
    .Where(e => e.IsActive)   // part of the SQL query
    .ToListAsync();
```

The same applies to `.AsEnumerable()` — once you call it, the rest of your LINQ chain runs in C#, not SQL.

## 5. Using EF Core for Bulk Operations

EF Core is not designed for bulk updates/deletes on thousands of rows:

```csharp
// ❌ Loads all records, marks each as modified, generates N UPDATE statements
var expiredSessions = await _db.UserSessions
    .Where(s => s.ExpiresAt < DateTime.UtcNow)
    .ToListAsync();

foreach (var session in expiredSessions)
    session.IsRevoked = true;

await _db.SaveChangesAsync();
```

```csharp
// ✅ EF Core 7+ ExecuteUpdateAsync — single UPDATE statement
await _db.UserSessions
    .Where(s => s.ExpiresAt < DateTime.UtcNow)
    .ExecuteUpdateAsync(s =>
        s.SetProperty(x => x.IsRevoked, true));

// ✅ EF Core 7+ ExecuteDeleteAsync — single DELETE statement
await _db.AuditLogs
    .Where(l => l.CreatedAt < DateTime.UtcNow.AddYears(-3))
    .ExecuteDeleteAsync();
```

For older EF Core versions or more complex bulk ops, I use `EFCore.BulkExtensions`:

```csharp
await _db.BulkUpdateAsync(recordsToUpdate);
await _db.BulkInsertAsync(newRecords);
```

## 6. Migration Pitfalls in Production

The most dangerous EF Core topic in enterprise systems.

```csharp
// ❌ NEVER do this in production startup code
app.Services.GetRequiredService<AppDbContext>().Database.Migrate();
```

This runs migrations synchronously at startup, can time out, and if two instances start simultaneously you get race conditions.

**What I do instead:**

```csharp
// Separate migration CLI tool / deployment script
// Run: dotnet ef database update --connection "..."
// Or apply in a pre-deployment step in your CI/CD pipeline
```

For zero-downtime deployments, follow the **expand-contract** pattern:

```sql
-- Migration 1 (deploy with old code): ADD nullable column
ALTER TABLE Invoices ADD DiscountRate DECIMAL(5,2) NULL;

-- Deploy new code (reads both old and new shape)

-- Migration 2 (deploy after): make it NOT NULL with default
ALTER TABLE Invoices ALTER COLUMN DiscountRate DECIMAL(5,2) NOT NULL DEFAULT 0;
```

Never rename or drop a column in the same migration as the deployment — the old code will break immediately.

## 7. Lazy Loading in Disguise

Lazy loading is disabled by default in EF Core, but if you install `Microsoft.EntityFrameworkCore.Proxies` and enable it, it's very easy to cause N+1 queries accidentally:

```csharp
// With lazy loading enabled and virtual navigation properties:
var invoice = await _db.Invoices.FindAsync(id);
var total = invoice.Lines.Sum(l => l.Amount); // triggers a lazy load here
```

My rule: **never enable lazy loading in production code**. Use explicit `.Include()` or projections. Lazy loading belongs in quick prototypes only.

## 8. Compiled Queries for Hot Paths

For frequently called queries (called hundreds of times per second), compiled queries eliminate the LINQ translation overhead:

```csharp
// Compiled query — translation happens once at startup
private static readonly Func<AppDbContext, Guid, Task<Invoice?>> GetInvoiceById =
    EF.CompileAsyncQuery((AppDbContext db, Guid id) =>
        db.Invoices
            .AsNoTracking()
            .Include(i => i.Lines)
            .FirstOrDefault(i => i.Id == id));

// Usage — no LINQ translation cost
var invoice = await GetInvoiceById(_db, invoiceId);
```

In our payroll processing engine where the same employee query runs thousands of times per payroll run, this reduced query overhead by ~40%.

## Summary Checklist

| Scenario | Solution |
|---|---|
| Loading related data | `.Include()` or projection |
| Multiple collection includes | `.AsSplitQuery()` |
| Read-only queries | `.AsNoTracking()` |
| Filtering | Always before `.ToList()` |
| Bulk update/delete | `ExecuteUpdateAsync` / `ExecuteDeleteAsync` |
| Production migrations | Separate deployment step, expand-contract |
| Lazy loading | Keep it disabled |
| High-frequency queries | Compiled queries |

EF Core is a great tool when you understand what SQL it generates. Keep SQL Server Profiler or the EF logging open during development — if you see unexpected queries, fix them before they reach production.
