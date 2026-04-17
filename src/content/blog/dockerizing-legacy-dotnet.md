---
title: "Dockerizing Legacy .NET Apps: A Practical Guide"
date: "2026-04-20"
tags: ["Docker", ".NET", "DevOps", "Legacy"]
excerpt: "Step-by-step guide to containerizing legacy .NET Framework applications—handling dependencies, configuration, and gradual migration to .NET Core."
---

# Dockerizing Legacy .NET Apps: A Practical Guide

Migrating legacy .NET Framework applications to containers isn't just about wrapping them in Docker. It's about understanding dependencies, configuration patterns, and preparing for eventual modernization.

This guide covers what I learned containerizing 15+ year-old ERP modules that were never designed for cloud deployment.

## Why Containerize Legacy Apps?

Before we dive into how, let's talk about why:

1. **Consistent environments**: No more "works on my machine"
2. **Isolation**: Legacy dependencies don't conflict with new services
3. **Gradual migration**: Run legacy and modern side-by-side
4. **Infrastructure abstraction**: Same deployment process for old and new
5. **Buy time**: Containerize now, refactor later

## Assessment Phase

### Inventory Your Application

Before touching Docker, document:

```markdown
## Application: Payroll.Web

**Framework**: .NET Framework 4.7.2
**Type**: ASP.NET Web Forms
**Dependencies**:
- Crystal Reports 13.0.20
- DevExpress 19.1
- SQL Server Native Client 11.0
- COM component: PayrollCalculator.dll

**Configuration**:
- Web.config transforms per environment
- Machine.config dependencies
- IIS application pool settings
- Windows authentication enabled

**External Resources**:
- File share: \\fileserver\payroll\exports
- SMTP server: smtp.internal
- Database: SQL Server 2016
```

### Identify Showstoppers

Some things don't containerize easily:

❌ **Windows Authentication** (Kerberos/NTLM)
❌ **COM Components** (unless you register them)
❌ **GAC Dependencies** (Global Assembly Cache)
❌ **Machine.config** modifications
❌ **File system paths** (C:\Program Files\...)

**Decision**: Can you refactor these? If not, containerization might not be worth it.

## Base Image Selection

### Option 1: Windows Container (Full Framework)

```dockerfile
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8-windowsservercore-ltsc2022

WORKDIR /inetpub/wwwroot

COPY . .

EXPOSE 80
```

**Pros**:
- Full .NET Framework compatibility
- No code changes required

**Cons**:
- Large image (~7GB)
- Windows-only hosts
- Slower startup

### Option 2: .NET Core Migration Path

If you plan to migrate to .NET Core eventually:

```dockerfile
# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

# Stage 2: Run
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 8080
ENTRYPOINT ["dotnet", "YourApp.dll"]
```

**Note**: This requires migrating to .NET Core first.

## Handling Dependencies

### NuGet Packages

Most packages work fine:

```dockerfile
COPY *.sln *.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish -c Release -o /app
```

### Native Dependencies

For native DLLs:

```dockerfile
# Install required Windows features
RUN powershell -Command \
    Add-WindowsFeature Web-Asp-Net45, \
                       Web-Windows-Auth

# Copy native dependencies
COPY libs\* C:\windows\system32\
```

### COM Components

This is tricky. Options:

1. **Register in container**:
```dockerfile
COPY PayrollCalculator.dll C:\PayrollCalculator.dll
RUN regasm PayrollCalculator.dll /codebase
```

2. **Replace with .NET wrapper**:
```csharp
// Instead of COM interop, create .NET service
public class PayrollCalculator
{
    public decimal Calculate(Employee emp) { ... }
}
```

3. **Keep on host, call via network**:
```csharp
// Legacy COM stays on Windows server
// Container calls via gRPC or REST
var result = await _payrollService.CalculateAsync(emp);
```

## Configuration Management

### Web.config Transforms

Legacy apps often use Web.config transforms:

```xml
<!-- Web.Debug.config -->
<configuration xmlns:xdt="Transform">
  <appSettings>
    <add key="DatabaseConnection" 
         value="Server=localhost;Database=PayrollDev" 
         xdt:Transform="SetAttributes" />
  </appSettings>
</configuration>
```

**In Docker**: Use environment variables instead:

```dockerfile
ENV ConnectionStrings__DefaultConnection=Server=db;Database=Payroll;User Id=sa;Password=xxx
```

```csharp
// Update code to read from environment
var connectionString = Environment.GetEnvironmentVariable(
    "ConnectionStrings__DefaultConnection");
```

### appsettings.json (for .NET Core)

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=db;Database=Payroll;"
  },
  "PayrollSettings": {
    "BatchSize": 1000,
    "RetryCount": 3
  }
}
```

Override with environment variables:
```bash
docker run -e PayrollSettings__BatchSize=500 ...
```

## Database Connectivity

### SQL Server Connection

```dockerfile
# Legacy: SQL Server Native Client
RUN powershell -Command \
    Invoke-WebRequest -Uri "https://go.microsoft.com/fwlink/?linkid=874124" \
    -OutFile "sqlncli.msi"; \
    Start-Process msiexec -ArgumentList "/i sqlncli.msi /quiet /norestart IACCEPTSQLNCLILICENSETERMS=YES" -Wait
```

**Better**: Use .NET Core's SqlClient:
```csharp
// No native client needed
using System.Data.SqlClient;
```

### Connection String in Docker Compose

```yaml
version: '3.8'
services:
  payroll-app:
    build: .
    environment:
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=Payroll;User Id=sa;Password=YourPassword123
    depends_on:
      - sqlserver
  
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123
    volumes:
      - sql-data:/var/opt/mssql

volumes:
  sql-data:
```

## File System Handling

### Problem: Hardcoded Paths

Legacy code often has:
```csharp
// Don't do this
var path = @"C:\Payroll\Exports\report.pdf";
```

### Solution: Configurable Paths

```csharp
// Do this instead
var basePath = Environment.GetEnvironmentVariable("EXPORT_PATH") 
               ?? "/app/exports";
var path = Path.Combine(basePath, "report.pdf");
```

### Docker Volume Mounts

```yaml
services:
  payroll-app:
    volumes:
      - payroll-exports:/app/exports
      - ./config:/app/config:ro  # Read-only config

volumes:
  payroll-exports:
```

## IIS-Specific Considerations

### Application Pool Settings

Legacy apps might depend on:
- 32-bit vs 64-bit
- Idle timeout settings
- Recycling configuration

**In Docker**: Configure in code or environment:
```dockerfile
# Set process model
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
```

### HTTP Modules and Handlers

```xml
<!-- Legacy Web.config -->
<system.webServer>
  <modules>
    <add name="CustomAuthModule" type="Auth.CustomAuthModule"/>
  </modules>
</system.webServer>
```

**In Docker**: Ensure assemblies are copied:
```dockerfile
COPY bin/CustomAuthModule.dll /app/
```

## Building the Docker Image

### Multi-Stage Build (Recommended)

```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8 AS build
WORKDIR /source

# Copy solution and projects
COPY *.sln .
COPY src/*.csproj ./src/
RUN nuget restore

# Copy everything else and build
COPY . .
RUN msbuild /p:Configuration=Release /p:DeployOnBuild=true /p:DeployDir=/app

# Run stage
FROM mcr.microsoft.com/dotnet/framework/aspnet:4.8
WORKDIR /inetpub/wwwroot

# Install any additional dependencies
RUN powershell -Command Add-WindowsFeature Web-Windows-Auth

COPY --from=build /app .

EXPOSE 80
```

### Build and Test Locally

```bash
# Build
docker build -t payroll-app:legacy .

# Run
docker run -p 8080:80 \
  -e ConnectionStrings__DefaultConnection="Server=localhost;Database=Payroll;" \
  payroll-app:legacy

# Test
curl http://localhost:8080
```

## Docker Compose for Development

```yaml
version: '3.8'
services:
  payroll-app:
    build: .
    ports:
      - "8080:80"
    environment:
      - ConnectionStrings__DefaultConnection=Server=sqlserver;Database=PayrollDev;User Id=sa;Password=DevPassword123
      - EXPORT_PATH=/app/exports
    volumes:
      - payroll-exports:/app/exports
    depends_on:
      - sqlserver
  
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=DevPassword123
    ports:
      - "1433:1433"
    volumes:
      - sql-data:/var/opt/mssql

volumes:
  payroll-exports:
  sql-data:
```

## Production Deployment

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: payroll-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: payroll-app
  template:
    metadata:
      labels:
        app: payroll-app
    spec:
      containers:
      - name: payroll-app
        image: your-registry/payroll-app:1.0.0
        ports:
        - containerPort: 80
        env:
        - name: ConnectionStrings__DefaultConnection
          valueFrom:
            secretKeyRef:
              name: db-connection
              key: connection-string
        resources:
          limits:
            memory: "2Gi"
            cpu: "1000m"
          requests:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: payroll-app-service
spec:
  selector:
    app: payroll-app
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer
```

### Health Checks

```dockerfile
# Add health check to Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD powershell -Command "try { (New-Object Net.WebClient).DownloadString('http://localhost/health') } catch { exit 1 }"
```

## Common Issues and Solutions

### Issue 1: Permission Denied on File Writes

**Problem**: App tries to write to C:\Program Files\...

**Solution**:
```dockerfile
# Create writable directory
RUN mkdir C:\app\data
RUN icacls C:\app\data /grant Everyone:(OI)(CI)F

# Update app to use this path
ENV DATA_PATH=C:\app\data
```

### Issue 2: Certificate Errors

**Problem**: SSL certificate validation fails.

**Solution** (development only):
```dockerfile
# Import development certificate
COPY dev-cert.pfx /certs/
RUN certutil -f -p YourPassword -importpfx /certs/dev-cert.pfx
```

**Production**: Use proper certificates, don't disable validation.

### Issue 3: Memory Leaks

**Problem**: Legacy apps weren't designed for container memory limits.

**Solution**:
```yaml
# Set memory limits
resources:
  limits:
    memory: "2Gi"
  requests:
    memory: "1Gi"
```

Monitor and adjust based on actual usage.

## Migration Path to .NET Core

Containerization is often step one. Step two is modernization:

### Phase 1: Strangler Fig

Run legacy in Docker, new features in .NET Core:

```
┌─────────────────┐     ┌─────────────────┐
│   Legacy App    │     │   New Features  │
│   (.NET 4.8)    │     │   (.NET 8)      │
│   in Docker     │     │   in Docker     │
└─────────────────┘     └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌─────────────┐
              │ API Gateway │
              └─────────────┘
```

### Phase 2: Incremental Rewrite

Rewrite one module at a time:
1. Start with least coupled module
2. Create .NET Core version
3. Route traffic to new version
4. Decommission legacy module

### Phase 3: Full Migration

Eventually, legacy container runs zero traffic. Remove it.

## Key Takeaways

1. **Assess first**: Understand dependencies before containerizing
2. **Windows containers for Full Framework**: Don't fight it
3. **Configuration via environment**: No more config transforms
4. **Volumes for state**: Don't store state in containers
5. **Plan for modernization**: Containerization is a stepping stone, not the destination

---

*Containerizing legacy apps? Happy to share more war stories. Find me on [GitHub](https://github.com/vimalgovind143) or [LinkedIn](https://linkedin.com/in/vimalgovind/).*
