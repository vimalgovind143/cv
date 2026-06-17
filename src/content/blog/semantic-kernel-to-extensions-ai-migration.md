---
title: 'Migrating from Semantic Kernel Abstractions to Microsoft.Extensions.AI'
date: '2026-06-09'
tags: ['Microsoft.Extensions.AI', 'Semantic Kernel', '.NET', 'AI', 'Migration']
excerpt: 'Microsoft.Extensions.AI is GA, and the old Semantic Kernel chat and embedding interfaces are now obsolete. A practical, code-first guide to migrating without a big-bang rewrite.'
---

# Migrating from Semantic Kernel Abstractions to Microsoft.Extensions.AI

If you built a .NET AI feature in the last couple of years, there is a good chance it depends on `IChatCompletionService` or `ITextEmbeddingGenerationService` from Semantic Kernel. Those interfaces are now obsolete. The replacement, `Microsoft.Extensions.AI`, reached general availability and is the abstraction the rest of the .NET AI ecosystem — including Semantic Kernel and the Microsoft Agent Framework — is being rebuilt on.

This is not a panic migration. The old interfaces still work, and there are adapters to bridge the gap. But the direction is settled, so it is worth doing the move deliberately rather than discovering it the day the obsolete APIs are removed.

## What Replaces What

The two interfaces you care about:

| Old Semantic Kernel interface | New Microsoft.Extensions.AI interface |
| --- | --- |
| `IChatCompletionService` | `IChatClient` |
| `ITextEmbeddingGenerationService` | `IEmbeddingGenerator<string, Embedding<float>>` |

`ITextEmbeddingGenerationService` is marked `[Obsolete]` with a message pointing at the new generator, and Microsoft's guidance is to migrate as soon as practical because it will be removed in a future release.

## The Division Of Responsibilities

The cleanest way to think about the two libraries:

- **`Microsoft.Extensions.AI`** is the foundation — provider-agnostic building blocks (`IChatClient`, `IEmbeddingGenerator`) plus middleware for function calling, caching, and telemetry. There are two packages: `Microsoft.Extensions.AI.Abstractions` (just the exchange types, for libraries) and `Microsoft.Extensions.AI` (the utilities and DI helpers, for apps).
- **Semantic Kernel** is the orchestration layer — agents, plugins, planners — and it is being re-platformed to sit *on top of* those building blocks.

So this is not Extensions.AI versus Semantic Kernel. It is Extensions.AI underneath, Semantic Kernel above.

## Embeddings: Before And After

Registration changes name but not shape:

```csharp
// BEFORE
#pragma warning disable SKEXP0010
builder.Services.AddOpenAITextEmbeddingGeneration(
    modelId: "text-embedding-3-small", apiKey: key);

// AFTER
using Microsoft.Extensions.AI;
builder.Services.AddOpenAIEmbeddingGenerator(
    modelId: "text-embedding-3-small", apiKey: key);
```

Usage has one gotcha worth internalizing — the return type changed:

```csharp
// BEFORE — returns ReadOnlyMemory<float>
var svc = kernel.GetRequiredService<ITextEmbeddingGenerationService>();
var embedding = await svc.GenerateEmbeddingAsync(text);
Console.WriteLine(embedding.Length);

// AFTER — returns Embedding<float>; the vector lives on .Vector
var gen = kernel.GetRequiredService<IEmbeddingGenerator<string, Embedding<float>>>();
var embedding = await gen.GenerateAsync(text);
Console.WriteLine(embedding.Vector.Length);
```

The method names also unify: `GenerateEmbeddingAsync` / `GenerateEmbeddingsAsync` both become `GenerateAsync`. If you have a vector store layer, this is the line you will touch most.

## Chat: Before And After

```csharp
// AFTER — a direct IChatClient call
IChatClient client = /* e.g. openAIClient.GetChatClient("gpt-4o").AsIChatClient() */;

var response = await client.GetResponseAsync(
[
    new(ChatRole.System, "You are a helpful assistant."),
    new(ChatRole.User, "Summarize this invoice batch."),
]);

Console.WriteLine(response);
```

Semantic Kernel registration helpers like `AddOpenAIChatClient()` and `AddAzureOpenAIChatClient()` now register an `IChatClient`, and `ChatCompletionAgent` accepts either the old service or the new client during the transition.

## Migrate Incrementally With Adapters

You do not have to convert everything at once. There are adapters at the boundary:

```csharp
// Wrap an existing SK embedding service as the new interface
IEmbeddingGenerator<string, Embedding<float>> gen =
    oldEmbeddingService.AsEmbeddingGenerator();
```

There are equivalent chat adapters in both directions, so you can convert one layer, leave the rest, and move on. This is how I would approach a large codebase: change the registration and the lowest-level call sites first, bridge everything else, then chip away.

## The Payoff: Middleware

The reason to want this migration, beyond avoiding obsolete APIs, is the pipeline. `IChatClient` composes with a builder, and the order of the calls is the order of wrapping:

```csharp
IChatClient client = new ChatClientBuilder(innerClient)
    .UseDistributedCache(cache)      // cache responses by chat history
    .UseFunctionInvocation()         // automatic tool calling
    .UseOpenTelemetry(sourceName: "cv-ai")
    .UseLogging(loggerFactory)
    .Build();
```

For enterprise work this is genuinely valuable: caching, automatic function invocation (including MCP tools), OpenTelemetry that follows the GenAI semantic conventions, and request/response logging — all as cross-cutting layers instead of code scattered through your services. You can also write custom middleware by subclassing `DelegatingChatClient`.

## Gotchas Worth Knowing

- **Return-type shape.** Embeddings now return `Embedding<float>`; reach the numbers through `.Vector`. Multi-input calls return a `GeneratedEmbeddings<...>` collection.
- **Minimum versions.** The embeddings migration needs a recent Semantic Kernel (1.51 or later). Patch versions of the Extensions.AI packages move quickly, so confirm on NuGet at the time you migrate.
- **Per-call options.** Settings like temperature and model id move into `ChatOptions` / `EmbeddingGenerationOptions` passed per request, with provider-specific knobs via `AdditionalProperties`.
- **Statefulness.** For services that keep conversation state server-side, use `ChatOptions.ConversationId` instead of always resending the full history.

## Final Thought

This migration is mostly mechanical, and the adapters make it safe to do gradually. The reason to prioritize it is not that the old interfaces stopped working — it is that everything new in .NET AI, from Semantic Kernel's own internals to the Agent Framework, now speaks `IChatClient` and `IEmbeddingGenerator`. Get onto the foundation, and the rest of the stack lines up behind you.

References:

- [Microsoft.Extensions.AI libraries — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/microsoft-extensions-ai)
- [Use the IChatClient interface — Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/ai/ichatclient)
- [Migrating to IEmbeddingGenerator — Microsoft Learn](https://learn.microsoft.com/en-us/semantic-kernel/support/migration/text-embedding-obsolete-migration-guide)
- [AI and Vector Data Extensions are now GA — .NET Blog](https://devblogs.microsoft.com/dotnet/ai-vector-data-dotnet-extensions-ga/)
- [Semantic Kernel and Microsoft.Extensions.AI: Better Together](https://devblogs.microsoft.com/semantic-kernel/semantic-kernel-and-microsoft-extensions-ai-better-together-part-1/)
