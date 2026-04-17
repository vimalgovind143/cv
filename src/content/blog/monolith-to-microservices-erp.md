---
title: "From Monolith to Microservices: My ERP Migration Journey"
date: "2026-04-17"
tags: [".NET", "Microservices", "Architecture", "Case Study"]
excerpt: "A real-world account of migrating a 15-year-old monolithic ERP system to microservices—what worked, what didn't, and lessons learned along the way."
---

# From Monolith to Microservices: My ERP Migration Journey

After 15 years of running a monolithic ERP system handling payroll, accounting, inventory, and trading for multiple companies, we made the call: it was time to modernize.

This isn't a theoretical architecture post. This is the story of what actually happened when we migrated a production ERP serving real businesses with real money and real deadlines.

## The Starting Point

Our legacy system was a classic ASP.NET Web Forms monolith:

- **Single database**: 500+ tables, all shared
- **Tight coupling**: Payroll couldn't exist without Accounting
- **Deployment fear**: One wrong change could break everything
- **Scaling limits**: Vertical scaling only, expensive hardware

The system worked. But it was fragile, slow to change, and expensive to maintain.

## Why Microservices?

We didn't start with "microservices" as the goal. We started with problems:

1. **Deployment risk**: A payroll fix shouldn't require redeploying inventory
2. **Team velocity**: Multiple teams blocked on each other
3. **Performance**: One slow query could bring down the whole system
4. **Technology lock-in**: Stuck on old .NET Framework versions

Microservices emerged as a solution to these specific problems, not as an architectural ideal.

## The Migration Strategy

### Phase 1: Strangler Fig Pattern

We didn't rewrite. We incrementally replaced:

```
┌─────────────────────────────────────────────────┐
│              Legacy Monolith                    │
│  ┌─────────┬─────────┬─────────┬─────────┐     │
│  │ Payroll │ Account │ Inventory│ Trading │     │
│  └─────────┴─────────┴─────────┴─────────┘     │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│         API Gateway / Reverse Proxy             │
└─────────────────────────────────────────────────┘
         │              │              │
         ↓              ↓              ↓
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│  Payroll    │ │  Inventory  │ │   Trading   │
│  Service    │ │   Service   │ │   Service   │
│  (.NET 8)   │ │  (.NET 8)   │ │  (.NET 8)   │
└─────────────┘ └─────────────┘ └─────────────┘
         │              │              │
         └──────────────┴──────────────┘
                        │
                        ↓
              ┌─────────────────┐
              │   Legacy DB     │
              │  (shared temp)  │
              └─────────────────┘
```

We started with the **Payroll Service**—high value, well-understood domain, clear boundaries.

### Phase 2: Database Decomposition

The hardest part wasn't code. It was data:

**Before**: One database, 500 tables, everything joined to everything.

**After**: Each service owns its data. No direct database access between services.

```
Payroll Service          Accounting Service
┌─────────────────┐     ┌─────────────────┐
│ Employees       │     │ General Ledger  │
│ Salaries        │     │ Journal Entries │
│ Deductions      │     │ Chart of Accounts│
│ Tax Rules       │     │ Financial Reports│
└─────────────────┘     └─────────────────┘
       │                        │
       │   Events               │   Events
       ↓                        ↓
┌─────────────────────────────────────────┐
│         Message Bus (RabbitMQ)          │
└─────────────────────────────────────────┘
```

Key principle: **Eventual consistency**. When payroll runs, it publishes `PayrollProcessed` events. Accounting subscribes and updates ledgers asynchronously.

### Phase 3: Infrastructure Modernization

We containerized everything:

```dockerfile
# Dockerfile for Payroll Service
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
COPY . .
RUN dotnet publish -c Release -o /app

FROM base
COPY --from=build /app .
ENTRYPOINT ["dotnet", "PayrollService.dll"]
```

Kubernetes orchestration gave us:

- Auto-scaling based on CPU/memory
- Rolling deployments with zero downtime
- Self-healing when containers crash
- Resource isolation between services

## What Actually Improved

### Deployment Frequency
- **Before**: 2-4 deployments per month (high risk)
- **After**: Multiple deployments per day per service (low risk)

### Mean Time to Recovery
- **Before**: Hours to diagnose and rollback
- **After**: Minutes—just rollback the affected service

### Team Velocity
- **Before**: Teams blocked on each other's release cycles
- **After**: Teams deploy independently

### Performance
- **Before**: Single point of failure, cascading slowdowns
- **After**: Services scale independently, failures isolated

## What Got Harder

### Distributed Transactions
You can't just use `TransactionScope` anymore. We implemented:

1. **Saga pattern** for multi-service workflows
2. **Outbox pattern** for reliable event publishing
3. **Idempotency** on all event handlers

### Observability
Debugging distributed systems requires new tools:

- **Centralized logging** (ELK stack)
- **Distributed tracing** (OpenTelemetry)
- **Service mesh** for traffic visibility

### Data Consistency
Eventual consistency is fine until it's not. We learned:

- Design for idempotency from day one
- Build compensation transactions for rollbacks
- Monitor event lag and alert on thresholds

## The Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | .NET 8 |
| Containers | Docker |
| Orchestration | Kubernetes |
| API Gateway | YARP (Yet Another Reverse Proxy) |
| Message Bus | RabbitMQ |
| Database | SQL Server (per service) |
| Caching | Redis |
| Monitoring | Prometheus + Grafana |
| Tracing | OpenTelemetry |

## Lessons Learned

### 1. Start with Clear Boundaries
Don't split by technical layer (UI, API, DB). Split by **business capability** (Payroll, Inventory, Trading).

### 2. Invest in Observability Early
You can't debug what you can't see. Set up logging, tracing, and metrics before you migrate.

### 3. Embrace Eventual Consistency
If you need strong consistency, you're building a distributed monolith. Accept eventual consistency and design for it.

### 4. Automate Everything
Manual deployments at scale are painful. CI/CD isn't optional.

### 5. Don't Microservice Everything
Some things stay monolithic. Our reporting module? Still monolithic. And that's fine.

## Results After 18 Months

- **60% performance improvement** in core transactions
- **75% reduction in deployment time**
- **Zero major outages** from deployment issues
- **Team satisfaction up**—developers can ship without fear

## Would I Do It Again?

Yes. But I'd start smaller, invest more in observability upfront, and resist the urge to microservice everything.

The goal isn't microservices. The goal is **shipping value faster with less risk**. Microservices are just a tool.

---

*Have questions about specific parts of the migration? Drop a comment or reach out on [LinkedIn](https://linkedin.com/in/vimalgovind/).*
