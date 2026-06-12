export type CvKnowledgeEntry = {
  title: string;
  section: string;
  content: string;
  url?: string;
};

export const CV_ASSISTANT_EMAIL = 'hey@hellovg.win';

export const CV_AI_QUOTA_MESSAGE =
  'My 8-5 timing finished. The AI quota clocked out for today, so please contact me by email: hey@hellovg.win';

export const CV_OUT_OF_SCOPE_MESSAGE =
  "I can only answer from Vimal's CV, projects, skills, blog topics, and contact details. Ask me about his ERP work, .NET background, AI experience, Semantic Kernel, or email him at hey@hellovg.win.";

export const CV_KNOWLEDGE: CvKnowledgeEntry[] = [
  {
    title: 'Profile',
    section: 'summary',
    content:
      'Vimal Govind Markkasseri is a Senior Full Stack Engineer based in Manama, Bahrain. He has 16+ years of experience delivering enterprise ERP systems, modernizing legacy platforms, and adding practical AI capabilities. His work spans .NET Core, ASP.NET, SQL Server, React, Angular, TypeScript, cloud infrastructure, and applied AI.',
    url: '/',
  },
  {
    title: 'Current Role',
    section: 'work',
    content:
      'Vimal works at Al Amthal Group BSC Closed in Bahrain. He is currently Support Manager, leading software support and operations for critical enterprise applications and infrastructure. He previously served as Senior Software Engineer and Software Engineer at the same company.',
    url: '/about',
  },
  {
    title: 'Enterprise ERP Experience',
    section: 'domain',
    content:
      'Vimal has deep ERP experience across payroll, accounting, sales order management, trading, inventory, warehouse operations, microfinance, loan management, reporting, and multi-company enterprise workflows. He has worked on formula-based payroll engines, general ledger systems, integrated accounting, inventory platforms, and enterprise trading systems.',
    url: '/projects',
  },
  {
    title: 'System Modernization',
    section: 'project',
    content:
      'Vimal led modernization of legacy ERP systems to .NET Core architecture using Clean Architecture, microservices patterns, containerization, cloud deployment, Docker, Azure, and automated deployment pipelines. Reported outcomes include improved performance, lower deployment time, and better maintainability.',
    url: '/projects',
  },
  {
    title: 'Applied AI and Semantic Kernel',
    section: 'ai',
    content:
      'Vimal has practical experience and active project work with Semantic Kernel, Azure OpenAI, native plugins, function calling, retrieval patterns, RAG, and Microsoft.Extensions.AI. His Semantic Kernel ERP Workflow Assistant concept focuses on retrieving customer balances, explaining payroll exceptions, drafting approval summaries, and routing operational requests with human review before sensitive actions.',
    url: '/projects',
  },
  {
    title: 'Technical Skills',
    section: 'skills',
    content:
      'Key skills include .NET Core, ASP.NET, Entity Framework Core, JavaScript, React, Angular, TypeScript, REST APIs, Web APIs, SignalR, SQL Server, database design, Clean Architecture, SOLID, microservices, Docker, Kubernetes, Azure, cloud infrastructure, Git, ERP systems, performance optimization, Semantic Kernel, Azure OpenAI, AI agents, function calling, RAG, and prompt engineering.',
    url: '/about',
  },
  {
    title: 'Enterprise Payroll System',
    section: 'project',
    content:
      'The Enterprise Payroll System project involved payroll management for multi-company operations, complex tax calculations, statutory compliance, formula-based salary computation, allowances, deductions, and Middle Eastern market requirements. It reduced payroll processing time while maintaining compliance.',
    url: '/projects',
  },
  {
    title: 'Integrated Accounting System',
    section: 'project',
    content:
      'The Integrated Accounting System project covered multi-company general ledger, real-time transaction processing, inter-company reconciliation, financial reporting, period-end closing automation, budget variance analysis, compliance reporting, concurrent user operations, transaction integrity, and audit trails.',
    url: '/projects',
  },
  {
    title: 'Inventory Management Platform',
    section: 'project',
    content:
      'The Inventory Management Platform project included real-time stock tracking across multiple warehouses, automated reordering, safety stock calculations, inventory reporting, demand forecasting, stock level optimization, and accurate inventory visibility across business units.',
    url: '/projects',
  },
  {
    title: 'Microfinance Management System',
    section: 'project',
    content:
      'The Microfinance Management System project included loan management, customizable repayment schedules, borrower portfolio tracking, credit assessment, collateral management, loan disbursement workflows, regulatory reporting, payment reconciliation, and audit trails.',
    url: '/projects',
  },
  {
    title: 'Blog Topics',
    section: 'blog',
    content:
      'Vimal writes about enterprise software lessons, practical AI in enterprise apps, Semantic Kernel for .NET enterprise AI agents, Semantic Kernel plugins for ERP workflows, Semantic Kernel production checklists, ASP.NET Core API patterns, Clean Architecture in .NET, CQRS with MediatR, EF Core production pitfalls, SQL Server performance and indexing, Dockerizing legacy .NET, ERP modernization, multi-tenant ERP, React performance, TypeScript patterns, and AI code review assistants.',
    url: '/blog',
  },
  {
    title: 'Contact',
    section: 'contact',
    content:
      'Vimal can be contacted by email at hey@hellovg.win. His website is hellovg.win, GitHub is github.com/vimalgovind143, LinkedIn is linkedin.com/in/vimalgovind, and X is x.com/vimalgovind.',
    url: '/',
  },
];

const TOKEN_PATTERN = /[a-z0-9+#.]+/gi;

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'can',
  'does',
  'for',
  'from',
  'has',
  'he',
  'his',
  'in',
  'is',
  'me',
  'of',
  'on',
  'or',
  'show',
  'tell',
  'the',
  'to',
  'vimal',
  'what',
  'with',
]);

const OUT_OF_SCOPE_PATTERNS = [
  /\b(capital|weather|news|stock|crypto|price|recipe|movie|sports|translate|homework)\b/i,
  /\b(write|generate|create|build|debug|fix|implement|refactor)\b.*\b(code|component|app|script|function|class|sql|api)\b/i,
  /\b(how do i|how to|teach me|tutorial|step by step)\b/i,
];

function tokenize(value: string) {
  return (value.toLowerCase().match(TOKEN_PATTERN) ?? []).filter(
    (token) => token.length > 1 && !STOP_WORDS.has(token),
  );
}

export function isClearlyOutsideCvScope(question: string) {
  return OUT_OF_SCOPE_PATTERNS.some((pattern) => pattern.test(question));
}

export function findRelevantCvKnowledge(question: string, limit = 5) {
  if (isClearlyOutsideCvScope(question)) {
    return [];
  }

  const queryTokens = tokenize(question);

  if (queryTokens.length === 0) {
    return [];
  }

  const scoredEntries = CV_KNOWLEDGE.map((entry) => {
    const text = `${entry.title} ${entry.section} ${entry.content}`;
    const entryTokens = new Set(tokenize(text));
    const score = queryTokens.reduce(
      (total, token) => total + (entryTokens.has(token) || text.toLowerCase().includes(token) ? 1 : 0),
      0,
    );

    return { entry, score };
  });

  return scoredEntries
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ entry }) => entry)
    .slice(0, limit);
}
