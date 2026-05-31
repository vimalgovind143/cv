---
title: 'Designing Semantic Kernel Plugins for ERP Workflows'
date: '2026-05-28'
tags: ['Semantic Kernel', 'ERP', '.NET', 'Architecture', 'AI Agents']
excerpt: 'How I would design Semantic Kernel native plugins for ERP systems without letting AI bypass domain rules, permissions, or audit requirements.'
---

# Designing Semantic Kernel Plugins for ERP Workflows

ERP systems are a good fit for AI-assisted workflows because users often know what they want in business language, but the system needs exact filters, codes, dates, and rules.

Semantic Kernel can bridge that gap if the plugin design is careful.

The mistake is exposing a random set of helper methods and hoping the model behaves. The better approach is to design plugins the same way we design application services: around business capabilities, permissions, and operational risk.

## Start With Business Boundaries

I would not create one large `ErpPlugin`.

I would split plugins by domain:

- `PayrollPlugin`
- `FinancePlugin`
- `InventoryPlugin`
- `CustomerAccountPlugin`
- `ApprovalWorkflowPlugin`
- `DocumentSearchPlugin`

This makes the available actions easier for the model to understand and easier for developers to secure.

## Separate Retrieval From Action

Retrieval functions are safer than action functions. They fetch information, explain state, and summarize records.

Action functions change something.

That difference should be visible in the API design.

```csharp
public sealed class ApprovalWorkflowPlugin
{
    [KernelFunction("get_pending_approvals")]
    [Description("Gets pending approval requests for a manager.")]
    public Task<IReadOnlyList<ApprovalRequestDto>> GetPendingApprovalsAsync(string managerId)
    {
        // Read-only retrieval.
    }

    [KernelFunction("draft_approval_decision")]
    [Description("Drafts an approval decision summary. Does not approve or reject the request.")]
    public Task<ApprovalDecisionDraft> DraftApprovalDecisionAsync(int requestId)
    {
        // Produces a draft only.
    }
}
```

Notice the second function drafts a decision. It does not commit the decision. That keeps the assistant useful without silently changing business state.

## Use Names The Model Can Understand

Function names should be simple and boring:

- `get_customer_balance`
- `find_payroll_exceptions`
- `summarize_inventory_shortages`
- `draft_supplier_email`
- `get_pending_approvals`

The model has to choose functions from descriptions. Clever names make that harder.

## Keep Authorization In The Service Layer

The plugin should not become a shortcut around application security. If a user cannot see a company, branch, employee, warehouse, or ledger account in the normal app, the plugin should not return it either.

The plugin should call the same application service used by the product UI or API.

```text
Semantic Kernel plugin
  -> Application service
  -> Authorization policy
  -> Domain validation
  -> Repository / SQL
```

That keeps AI features inside the same operational boundary as the rest of the system.

## Add Human Review To Write Paths

For ERP, human-in-the-loop is not optional for sensitive workflows.

Safe first versions:

- Draft a journal explanation, but do not post the journal.
- Draft a payroll exception note, but do not change salary data.
- Draft a supplier email, but do not send it automatically.
- Recommend an approval decision, but require a manager click.

This gives users speed without losing accountability.

## Final Thought

Semantic Kernel plugins should feel like well-designed application services, not magic endpoints. If the plugin boundary is clean, the assistant becomes easier to test, secure, explain, and support.

References:

- [Semantic Kernel plugins](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/)
- [Planning and function calling in Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/planning)
