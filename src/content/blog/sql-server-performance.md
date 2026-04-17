---
title: "SQL Server Performance Tuning: Lessons from ERP Systems"
date: "2026-04-14"
tags: ["Back End", "SQL", "Performance"]
excerpt: "Real-world SQL Server performance techniques I've used in enterprise ERP systems — indexes, query plans, CTEs, and avoiding the mistakes that kill throughput."
---

# SQL Server Performance Tuning: Lessons from ERP Systems

After optimizing payroll engines, inventory systems, and multi-company ledgers that process millions of rows daily, I've learned what actually matters for SQL Server performance. Here are the patterns I rely on.

## 1. Understand Your Execution Plan First

Before touching anything, read the execution plan. It tells you exactly where time is spent.

```sql
-- Always check the actual execution plan, not estimated
SET STATISTICS IO ON;
SET STATISTICS TIME ON;

SELECT e.EmployeeId, e.FullName, p.GrossAmount
FROM Employees e
INNER JOIN Payroll p ON p.EmployeeId = e.EmployeeId
WHERE p.PayPeriodId = 202403
  AND e.DepartmentId = 5;

SET STATISTICS IO OFF;
SET STATISTICS TIME OFF;
```

Look for:
- **Table Scans** → missing index
- **Key Lookups** → covering index needed
- **Sort operators** → can often be eliminated with the right index
- **Estimated rows ≠ Actual rows** → statistics are stale, run `UPDATE STATISTICS`

## 2. Covering Indexes Save Everything

A non-clustered index that **includes** all columns needed by the query avoids a key lookup back to the clustered index.

```sql
-- Bad: forces a Key Lookup for every row
CREATE NONCLUSTERED INDEX IX_Payroll_PayPeriod
ON Payroll (PayPeriodId);

-- Good: covers the query completely
CREATE NONCLUSTERED INDEX IX_Payroll_PayPeriod_Covering
ON Payroll (PayPeriodId, DepartmentId)
INCLUDE (EmployeeId, GrossAmount, NetAmount);
```

In our payroll system, adding the `INCLUDE` columns on this index dropped a report from 18 seconds to 400ms.

## 3. Avoid Functions on Indexed Columns

This is the most common performance killer I see in code reviews:

```sql
-- ❌ SARGable violation: index on TransactionDate is useless here
SELECT * FROM Transactions
WHERE YEAR(TransactionDate) = 2024
  AND MONTH(TransactionDate) = 3;

-- ✅ Range scan: uses the index efficiently
SELECT * FROM Transactions
WHERE TransactionDate >= '2024-03-01'
  AND TransactionDate <  '2024-04-01';
```

The same applies to `CONVERT()`, `ISNULL()`, `UPPER()` — if you wrap the column in a function, the index cannot be used.

## 4. CTEs vs Temp Tables vs Table Variables

Choosing the wrong one is surprisingly impactful.

```sql
-- CTE: good for readability, but not materialized
-- SQL Server may re-evaluate it multiple times
WITH MonthlyTotals AS (
    SELECT DepartmentId, SUM(GrossAmount) AS Total
    FROM Payroll
    WHERE PayPeriodId = 202403
    GROUP BY DepartmentId
)
SELECT d.Name, mt.Total
FROM MonthlyTotals mt
JOIN Departments d ON d.Id = mt.DepartmentId;

-- Temp Table: materialized, has its own stats, best for complex multi-step logic
SELECT DepartmentId, SUM(GrossAmount) AS Total
INTO #MonthlyTotals
FROM Payroll
WHERE PayPeriodId = 202403
GROUP BY DepartmentId;

CREATE INDEX IX_TMP ON #MonthlyTotals (DepartmentId);  -- you can even index it

SELECT d.Name, mt.Total
FROM #MonthlyTotals mt
JOIN Departments d ON d.Id = mt.DepartmentId;

DROP TABLE #MonthlyTotals;
```

**Rule of thumb:**
- Small intermediate result → `@TableVariable`
- Large or reused intermediate result → `#TempTable`
- Readability only, single use → `CTE`

## 5. Set-Based Thinking: Eliminate Cursors

Cursors process one row at a time. In SQL Server, that's almost always wrong.

```sql
-- ❌ Cursor: processes each employee one by one
DECLARE @EmpId INT, @Gross DECIMAL(18,2);
DECLARE cur CURSOR FOR SELECT EmployeeId FROM Employees;
OPEN cur;
FETCH NEXT FROM cur INTO @EmpId;
WHILE @@FETCH_STATUS = 0
BEGIN
    SELECT @Gross = SUM(Amount) FROM PayrollLines WHERE EmployeeId = @EmpId;
    UPDATE Payroll SET GrossAmount = @Gross WHERE EmployeeId = @EmpId;
    FETCH NEXT FROM cur INTO @EmpId;
END;
CLOSE cur; DEALLOCATE cur;

-- ✅ Set-based: processes all employees in one pass
UPDATE p
SET p.GrossAmount = agg.Total
FROM Payroll p
INNER JOIN (
    SELECT EmployeeId, SUM(Amount) AS Total
    FROM PayrollLines
    GROUP BY EmployeeId
) agg ON agg.EmployeeId = p.EmployeeId;
```

The set-based version is typically 10–100x faster and far more readable.

## 6. Pagination Done Right

The wrong pagination pattern is everywhere:

```sql
-- ❌ Slow on large tables: must process all 1M rows before skipping
SELECT TOP 20 * FROM AuditLog
WHERE CompanyId = 1
ORDER BY CreatedAt DESC
OFFSET 990000 ROWS FETCH NEXT 20 ROWS ONLY;

-- ✅ Keyset pagination: always O(1) regardless of page number
-- Pass the last seen Id from the previous page
SELECT TOP 20 *
FROM AuditLog
WHERE CompanyId = 1
  AND CreatedAt < @LastSeenCreatedAt  -- from previous page
ORDER BY CreatedAt DESC;
```

For audit logs in our ERP that hold 50M+ rows, keyset pagination made page loads instant.

## 7. Monitoring with DMVs

SQL Server's Dynamic Management Views are your best friend for finding problems in production:

```sql
-- Top 10 queries by total CPU time
SELECT TOP 10
    qs.total_worker_time / qs.execution_count AS avg_cpu_ms,
    qs.execution_count,
    SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
        ((CASE qs.statement_end_offset
            WHEN -1 THEN DATALENGTH(st.text)
            ELSE qs.statement_end_offset END
        - qs.statement_start_offset)/2)+1) AS query_text
FROM sys.dm_exec_query_stats qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) st
ORDER BY avg_cpu_ms DESC;

-- Missing indexes recommended by SQL Server
SELECT
    mid.statement AS table_name,
    migs.avg_user_impact AS potential_improvement_pct,
    'CREATE INDEX IX_Missing ON ' + mid.statement
    + ' (' + ISNULL(mid.equality_columns,'')
    + ISNULL(', ' + mid.inequality_columns,'') + ')'
    + ISNULL(' INCLUDE (' + mid.included_columns + ')','') AS create_index_statement
FROM sys.dm_db_missing_index_group_stats migs
JOIN sys.dm_db_missing_index_groups mig ON mig.index_group_handle = migs.group_handle
JOIN sys.dm_db_missing_index_details mid ON mid.index_handle = mig.index_handle
WHERE migs.avg_user_impact > 30
ORDER BY migs.avg_user_impact DESC;
```

## Summary

| Technique | Impact |
|-----------|--------|
| Covering indexes | High |
| SARGable predicates | High |
| Set-based vs cursor | Very High |
| Temp tables for complex queries | Medium |
| Keyset pagination | High (large tables) |
| DMV monitoring | Ongoing visibility |

Performance tuning is iterative — measure first, change one thing at a time, measure again.
