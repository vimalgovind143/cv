---
title: 'Microsoft Agent Framework: What the Semantic Kernel and AutoGen Merge Means for .NET Teams'
date: '2026-06-15'
tags: ['Microsoft Agent Framework', 'Semantic Kernel', '.NET', 'AI Agents', 'Enterprise']
excerpt: 'Microsoft folded Semantic Kernel and AutoGen into a single Agent Framework that went 1.0 in April 2026. Here is how I read the change for enterprise .NET systems, and how I would migrate without rewriting everything.'
---

# Microsoft Agent Framework: What the Semantic Kernel and AutoGen Merge Means for .NET Teams

For the last couple of years, a .NET team building AI agents had to pick a lane. Semantic Kernel gave you the enterprise-shaped foundations — dependency injection, plugins, structured workflows. AutoGen gave you the research-driven multi-agent patterns — group chat, reflection, dynamic collaboration. They overlapped enough to be confusing and differed enough to be annoying.

In October 2025 Microsoft announced **Microsoft Agent Framework** (MAF) to merge the two, and the 1.0 release landed in April 2026. Microsoft positions it as the successor to both Semantic Kernel and AutoGen. If you have invested in either, this is worth understanding before you start your next agent feature.

## What It Actually Is

MAF is an open-source SDK and runtime for building agents and multi-agent workflows, with the same concepts across .NET and Python. The part that matters most for a .NET shop is the foundation: **MAF is built directly on `Microsoft.Extensions.AI`.**

That single fact resolves a lot of architectural anxiety. An agent in MAF is assembled from an `IChatClient` — the same provider-agnostic abstraction you may already be using. Any middleware you have wrapped around that client (logging, retry, caching, rate limiting) keeps working underneath the agent. You are not adopting a parallel universe; you are layering orchestration on top of plumbing you already trust.

## The Shape Of An Agent

The core type is `AIAgent`, and the concrete agent you will use bridges to any `IChatClient`. A minimal agent looks roughly like this:

```csharp
using Microsoft.Extensions.AI;
using Microsoft.Agents.AI;

AIAgent agent = chatClient.CreateAIAgent(
    name: "PayrollHelper",
    instructions: "You help reconcile payroll exceptions. Always cite the source record.",
    tools: [AIFunctionFactory.Create(GetPayrollExceptions)]);

var thread = agent.GetNewThread();
var response = await agent.RunAsync("Summarize open exceptions for branch 04.", thread);
Console.WriteLine(response.Text);
```

A few things changed from the Semantic Kernel world that are worth calling out:

- **No `Kernel` is required** to create a basic agent.
- **Tools are plain C# methods.** You no longer need a `[KernelFunction]` attribute or a plugin wrapper — `AIFunctionFactory.Create(...)` turns a method into a tool, and a `[Description]` still feeds the model its contract.
- **One agent type** replaces the family of per-service classes (`ChatCompletionAgent`, `AzureAIAgent`, and so on). You configure the backing `IChatClient`, not a bespoke agent subclass.

The package is `Microsoft.Agents.AI` (with companion packages for OpenAI/Azure OpenAI, declarative agents, persistent agents, and A2A hosting). The API surface settled around the 1.0/GA window — thread-versus-session naming and a couple of factory methods shifted between the release candidate and GA — so check the current reference for the exact signatures rather than trusting a snapshot like this one.

## Multi-Agent Workflows

The other half of MAF is graph-based workflows with streaming, checkpointing, and human-in-the-loop pause/resume. There are several prebuilt orchestration patterns:

- **Sequential** — agents in a pipeline.
- **Concurrent** — fan out, then aggregate.
- **Handoff** — one agent routes to a specialist.
- **Group Chat** — agents collaborate in a shared conversation.
- **Magentic** — an LLM manager coordinates other agents against a progress ledger.

For enterprise work I treat these the way I treat any orchestration: start with **Sequential** or **Handoff**, which are easy to reason about and audit, and only reach for Group Chat or Magentic when a problem genuinely needs open-ended collaboration. Autonomy is a cost, not a feature.

## What Happens To Your Semantic Kernel Code

This is the question everyone asks, so let me be precise about what is and is not true as of mid-2026:

- Microsoft **recommends** migrating Semantic Kernel projects to MAF and calls MAF the successor.
- Semantic Kernel and AutoGen continue to receive maintenance, with new investment going into MAF.
- Microsoft has **not** announced an end-of-life date for Semantic Kernel, and the migration is positioned as recommended, not forced. I would not describe SK as "deprecated."

In practice the migration is eased by the shared foundation. Because both sit on `Microsoft.Extensions.AI`, a lot of the work is a namespace swap, simpler agent construction, and dropping the plugin attributes. The orchestration concepts map across.

## How I Would Approach It

If I were advising a team today:

- **New agent features:** start on MAF. There is little reason to begin new work on the older APIs.
- **Existing Semantic Kernel systems in production:** do not rush a rewrite. Migrate when you are already touching that code, and lean on the shared `Microsoft.Extensions.AI` layer so the change is incremental.
- **Keep your guardrails:** MAF's middleware has three interception points — agent-level (audit, authorization), function-level (validation, budgets), and chat-level (raw messages, tokens, caching). The enterprise discipline I wrote about for Semantic Kernel — read-heavy first, human approval for high-impact actions, full audit logging — carries over unchanged. The framework changed; the responsibilities did not.

## Final Thought

The merge is good news. One framework, one set of concepts, built on the abstraction the rest of the .NET AI stack already uses. For teams that found the SK-versus-AutoGen choice confusing, that confusion is now gone. The work that actually matters — narrow tools, reused authorization, audit trails, human review before impact — is exactly the same as before.

References:

- [Introducing Microsoft Agent Framework — Azure Blog](https://azure.microsoft.com/en-us/blog/introducing-microsoft-agent-framework/)
- [Microsoft Agent Framework Version 1.0](https://devblogs.microsoft.com/agent-framework/microsoft-agent-framework-version-1-0/)
- [Semantic Kernel to Agent Framework migration guide](https://learn.microsoft.com/en-us/agent-framework/migration-guide/from-semantic-kernel/)
- [Workflow orchestrations in Agent Framework](https://learn.microsoft.com/en-us/agent-framework/workflows/orchestrations/)
- [Microsoft.Agents.AI on NuGet](https://www.nuget.org/packages/Microsoft.Agents.AI/)
