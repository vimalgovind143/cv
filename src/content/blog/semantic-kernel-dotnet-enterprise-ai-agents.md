---
title: 'Semantic Kernel in .NET: A Practical Enterprise Starting Point'
date: '2026-05-29'
tags: ['Semantic Kernel', '.NET', 'AI', 'Azure OpenAI', 'Enterprise']
excerpt: 'A practical way to think about Semantic Kernel for enterprise .NET systems: keep the business logic in code, expose safe plugins, and let the model orchestrate narrow workflows.'
---

# Semantic Kernel in .NET: A Practical Enterprise Starting Point

Semantic Kernel becomes useful in enterprise applications when we stop treating it as a chatbot framework and start treating it as an orchestration layer around existing business capabilities.

That distinction matters. Most enterprise systems already have the hard parts: payroll rules, accounting validations, approval workflows, stock movement logic, customer credit checks, and audit requirements. The AI layer should not replace those rules. It should help users reach the right rule faster, explain the result clearly, and automate the low-risk steps around it.

## The Architecture I Prefer

For a .NET ERP system, I would start with this shape:

```text
User request
  -> Chat or command surface
  -> Semantic Kernel
  -> Native plugins
  -> Existing application services
  -> SQL Server / APIs
  -> Human review for sensitive actions
```

The kernel should not talk directly to the database. It should call application services that already enforce authorization, validation, logging, and transaction boundaries.

## What Goes Into A Plugin

Semantic Kernel plugins map well to enterprise service boundaries. A payroll plugin should expose payroll capabilities. An inventory plugin should expose inventory capabilities. A finance plugin should expose finance capabilities.

Example plugin responsibilities:

```csharp
public sealed class PayrollPlugin
{
    private readonly PayrollExceptionService _exceptions;

    public PayrollPlugin(PayrollExceptionService exceptions)
    {
        _exceptions = exceptions;
    }

    [KernelFunction("get_payroll_exceptions")]
    [Description("Gets payroll exceptions for a company and payroll period.")]
    public Task<IReadOnlyList<PayrollExceptionDto>> GetPayrollExceptionsAsync(
        [Description("The company code.")] string companyCode,
        [Description("The payroll period in yyyy-MM format.")] string period)
    {
        return _exceptions.GetExceptionsAsync(companyCode, period);
    }
}
```

The function name and descriptions are not decoration. They are part of the contract the model uses when deciding which function to call.

## Where Semantic Kernel Helps

The practical wins are usually not dramatic at first. They look like this:

- "Explain why these employees have payroll exceptions."
- "Summarize the pending approvals for this branch."
- "Find customers with overdue balances and draft a follow-up note."
- "Compare this purchase order against recent supplier pricing."
- "Prepare a month-end checklist based on unresolved issues."

Each of these workflows combines retrieval, summarization, and task-specific business functions. That is where Semantic Kernel fits well.

## What I Would Avoid

I would not start by giving an agent broad write access to production workflows.

For sensitive domains like payroll, accounting, inventory, and lending, the first version should be read-heavy. If the assistant drafts an adjustment, journal note, email, or approval response, a human should confirm it before the system commits anything.

The best enterprise AI systems are boring in the right places. They log every function call, preserve source references, handle failure clearly, and ask for confirmation before impact.

## Production Checklist

Before shipping a Semantic Kernel feature into an ERP product, I would want:

- Narrow plugins with explicit function descriptions
- Existing authorization checks reused inside services
- Separate read functions and write functions
- Human approval for high-impact actions
- Full audit logging of prompts, function calls, and outputs
- Clear fallbacks when the model cannot complete a task
- Evaluation examples for common and risky user requests

## Final Thought

Semantic Kernel is most valuable when it respects the architecture already protecting the business. Keep domain logic in .NET services, expose carefully described plugins, and let the model orchestrate small workflows where language actually helps.

References:

- [Semantic Kernel quick start](https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide)
- [Semantic Kernel plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/)
- [Native plugins in Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/adding-native-plugins)
