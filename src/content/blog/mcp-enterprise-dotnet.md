---
title: 'MCP for Enterprise .NET: Connecting Agents to Your ERP Without the Glue Code'
date: '2026-06-12'
tags: ['MCP', '.NET', 'AI Agents', 'Enterprise', 'Security']
excerpt: 'The Model Context Protocol has become the standard way to expose tools and data to AI agents. Here is how I think about MCP for enterprise .NET systems — the C# SDK, a minimal server, and the security questions you must answer first.'
---

# MCP for Enterprise .NET: Connecting Agents to Your ERP Without the Glue Code

Every team that builds AI features eventually hits the same wall: the model is only as useful as the systems it can reach. In an ERP world that means payroll, accounting, inventory, document stores, and a dozen internal APIs. The old answer was bespoke integration code for each model and each tool. The **Model Context Protocol (MCP)** replaces that with a single client-server standard.

MCP was created by Anthropic and introduced in late 2024. By 2026 it is no longer a single-vendor idea: it was donated to the Agentic AI Foundation under the Linux Foundation, and the major AI labs — Anthropic, OpenAI, Google, Microsoft — support it natively. For a .NET team, that maturity is the signal that it is safe to build on.

## The Mental Model

MCP is JSON-RPC under the hood, with three participants:

- **Host** — the AI application (an IDE, a chat surface, your agent runtime).
- **Client** — a connection the host maintains, one per server.
- **Server** — a program that exposes capabilities.

A server offers three kinds of things:

- **Tools** — functions the model can call (`get_payroll_exceptions`, `post_journal_entry`).
- **Resources** — data the model can read (a document, a report, a record).
- **Prompts** — reusable templates for common interactions.

The win is decoupling. You write one MCP server that wraps your payroll service, and any MCP-aware host can use it — your own agent today, a Copilot surface tomorrow — with no per-client integration.

## Transports: Pick The Right One

The spec now defines two transports, and the distinction matters for deployment:

- **stdio** — JSON-RPC over standard input/output. Local, single client, lowest overhead. Great for development and desktop tools. The catch: it spawns a process per connection, so it does not scale to many concurrent users.
- **Streamable HTTP** — a single HTTP endpoint with an optional streaming upgrade. This is what you want for any remote or multi-user enterprise deployment, because one server process can sit behind a load balancer and serve many clients.

The older two-endpoint HTTP+SSE transport is deprecated. Do not build new systems on it.

## Building A Server In C#

There is an official C# SDK — package `ModelContextProtocol`, maintained as a Microsoft and Anthropic collaboration — with companion packages for the lightweight core and for ASP.NET Core hosting. A minimal stdio server looks like this:

```csharp
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using ModelContextProtocol.Server;
using System.ComponentModel;

var builder = Host.CreateApplicationBuilder(args);

builder.Services
    .AddMcpServer()
    .WithStdioServerTransport()
    .WithToolsFromAssembly();

await builder.Build().RunAsync();

[McpServerToolType]
public static class PayrollTools
{
    [McpServerTool, Description("Gets open payroll exceptions for a company and period.")]
    public static Task<string> GetPayrollExceptions(
        [Description("The company code.")] string companyCode,
        [Description("The period in yyyy-MM format.")] string period)
        => PayrollService.GetExceptionsJsonAsync(companyCode, period);
}
```

The `[McpServerTool]` attribute and its `[Description]` define the contract the model sees. For an HTTP deployment you swap the stdio transport for the ASP.NET Core hosting package. Check NuGet for the current version — the SDK moved out of preview during 2026, so pin a version deliberately rather than guessing.

## How Agents Actually Consume It

Here is where the .NET AI stack lines up cleanly. `Microsoft.Extensions.AI` is the foundational abstraction; Semantic Kernel and the Microsoft Agent Framework build on top of it; and **both use the MCP C# SDK rather than reinventing it.** MCP tools surface as `AIFunction` objects, which means:

- In Semantic Kernel you convert an MCP tool with `AsKernelFunction()` and add it as a plugin.
- In Agent Framework the tools bind directly to the `Microsoft.Extensions.AI` abstractions, and the agent runtime drives the tool-call loop for you.

A rule of thumb on when MCP is worth the ceremony: for one or two tools, direct function calling is simpler. MCP pays off once you have roughly five or more tools, or when the same tools need to serve more than one application.

## The Security Conversation Comes First

This is the part I will not let a team skip. An MCP server **aggregates credentials for many backend systems**, which makes it a far higher-value target than any single API. The 2025–2026 track record is full of real incidents, so treat the following as requirements, not suggestions:

- **Prompt injection through tools.** Untrusted input — a support ticket, a document, a user message — can steer an agent into misusing its tools. The well-documented Supabase/Cursor incident combined privileged access, untrusted input, and a public output channel to exfiltrate tokens. Validate inputs and constrain what tools can do.
- **Tool poisoning and "rug pulls."** A malicious or silently-changed tool description can redirect data or inject instructions. An empirical study of ~1,900 open-source servers found over 5% with tool-poisoning issues. Monitor tool-definition changes; clients rarely detect them on their own.
- **Authorization.** The spec recommends OAuth, and **PKCE is essential**, especially for desktop and IDE clients. Watch for confused-deputy attacks where the server's elevated authority is abused.
- **Least privilege.** Treat an agent like a junior employee: give it the narrowest access that does the job, never a root-equivalent service account. Centralize secrets with rotation; log every tool call.

There were real CVEs here — command injection in a popular remote-bridge tool, unauthenticated command execution in a debugging utility — and frameworks like the OWASP MCP Top 10 now exist precisely because this surface is being actively attacked.

## Final Thought

MCP solves a real problem: it turns N models times M tools into one protocol. For enterprise .NET it slots neatly under `Microsoft.Extensions.AI`, Semantic Kernel, and Agent Framework, so adopting it is mostly additive. Just remember that a tool server sitting in front of payroll and accounting is now part of your attack surface. Design the auth, the least-privilege boundaries, and the audit logging before you expose the first tool.

References:

- [MCP architecture — Model Context Protocol docs](https://modelcontextprotocol.io/docs/concepts/architecture)
- [Microsoft partners with Anthropic on the official C# SDK for MCP](https://developer.microsoft.com/blog/microsoft-partners-with-anthropic-to-create-official-c-sdk-for-model-context-protocol)
- [modelcontextprotocol/csharp-sdk on GitHub](https://github.com/modelcontextprotocol/csharp-sdk)
- [Integrating MCP tools with Semantic Kernel](https://devblogs.microsoft.com/agent-framework/integrating-model-context-protocol-tools-with-semantic-kernel-a-step-by-step-guide/)
- [Donating MCP and establishing the Agentic AI Foundation — Anthropic](https://anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation)
