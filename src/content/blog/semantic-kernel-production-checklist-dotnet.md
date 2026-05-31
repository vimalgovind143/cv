---
title: 'A Production Checklist for Semantic Kernel in .NET Apps'
date: '2026-05-27'
tags: ['Semantic Kernel', '.NET', 'Azure OpenAI', 'Production', 'AI']
excerpt: 'The checklist I would use before adding Semantic Kernel to a production .NET application: observability, safety, permissions, evaluation, and fallback behavior.'
---

# A Production Checklist for Semantic Kernel in .NET Apps

Building a Semantic Kernel demo is straightforward. Building a production feature around it requires a different mindset.

The model is only one part of the system. The real production work is in permissions, logging, failure handling, evaluation, and user experience.

Here is the checklist I would use before shipping Semantic Kernel into a .NET business application.

## 1. Keep Business Logic Outside The Prompt

Prompts should guide behavior. They should not become the source of payroll rules, accounting rules, stock valuation rules, or approval policy.

Business logic belongs in tested .NET services. Semantic Kernel should call those services through native plugins.

## 2. Use Narrow Plugin Functions

Each function should do one understandable thing.

Good:

```text
get_customer_balance
get_overdue_invoices
draft_collection_email
```

Risky:

```text
process_customer_account
handle_finance_task
run_erp_action
```

Narrow functions are easier to describe, authorize, test, and audit.

## 3. Log Function Calls

For support and compliance, log:

- User identity
- Request timestamp
- Plugin function called
- Parameters passed
- Result status
- Model output
- Human approval status, if any

This is especially important when the assistant explains financial, payroll, or inventory data.

## 4. Design For Failure

The assistant should know what to do when something fails.

Examples:

- The model chooses the wrong function.
- A function returns no records.
- The user lacks permission.
- The downstream ERP service is unavailable.
- The model response is too vague.

The UI should expose this clearly instead of pretending the assistant succeeded.

## 5. Evaluate With Real Workflow Examples

Do not evaluate only happy paths.

Use examples like:

- Ambiguous company names
- Missing date ranges
- Unauthorized branch access
- Similar customer names
- Payroll period edge cases
- Large result sets
- Requests that mix read and write operations

These are the cases that break real systems.

## 6. Add Human Approval For Sensitive Actions

For ERP systems, I would require approval before:

- Posting journals
- Changing payroll data
- Sending external emails
- Updating credit limits
- Approving or rejecting workflow requests
- Moving inventory

The assistant can draft, summarize, validate, and recommend. The user should commit.

## 7. Version Prompts And Plugin Contracts

Treat prompts and plugin descriptions as production assets.

When they change, track:

- What changed
- Why it changed
- Which workflows are affected
- Whether evaluation examples still pass

This makes AI behavior less mysterious when support tickets arrive.

## Final Thought

Semantic Kernel works best in production when it is boringly engineered. Give it narrow tools, reuse existing services, log the important decisions, and keep humans in control of high-impact actions.

References:

- [Semantic Kernel quick start](https://learn.microsoft.com/en-us/semantic-kernel/get-started/quick-start-guide)
- [Native plugins in Semantic Kernel](https://learn.microsoft.com/en-us/semantic-kernel/concepts/plugins/adding-native-plugins)
