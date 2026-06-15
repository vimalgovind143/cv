// CV knowledge base — data only.
//
// This file holds the curated CV_KNOWLEDGE array. It is plain ESM so the
// `scripts/check-knowledge.mjs` validator and `node --test` can load it
// without a TypeScript toolchain. The TS facade in `cv-knowledge.ts` owns
// the type definitions and re-exports this array as `CV_KNOWLEDGE`.
//
// All facts MUST be faithful to `src/data/resume-data.tsx`. The check
// script fails CI if it finds placeholder words (TBD, TODO, FIXME) or
// fabricated numbers, so when in doubt copy text verbatim from the
// resume data file rather than paraphrasing.

export const CV_KNOWLEDGE_VERSION = '2026-06-14.1';

export const CV_OUT_OF_SCOPE_MESSAGE =
  "I can only answer from Vimal's CV, projects, skills, blog topics, and contact details. Ask me about his ERP work, .NET background, AI experience, Semantic Kernel, or email him at hey@hellovg.win.";

export const CV_SENSITIVE_QUESTION_MESSAGE =
  "I can't share that on the public site. For sensitive questions (salary, visa, interview logistics, etc.) please email me directly at hey@hellovg.win — I usually reply within a day.";

export const CV_AI_QUOTA_MESSAGE =
  'My 8-5 timing finished. The AI quota clocked out for today, so please contact me by email: hey@hellovg.win';

export const CV_ASSISTANT_EMAIL = 'hey@hellovg.win';

export const CV_KNOWLEDGE = [
  // ──────────────────────────────────────────────────────────────
  // PROFILE & CONTACT
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Profile',
    section: 'profile',
    content:
      'Mr Vimal Govind Markkasseri is a Senior Full Stack Engineer based in Manama, Bahrain (GMT+3). He has 16+ years of experience delivering enterprise ERP solutions end-to-end, spanning .NET Core, ASP.NET, SQL Server, modern web technologies (React, Angular, TypeScript), cloud infrastructure (Azure, Docker, Kubernetes), and applied AI with Semantic Kernel and Azure OpenAI. He focuses on clarity, reliability, and long-term maintainability, and enjoys partnering with cross-functional teams to modernize legacy systems and simplify complex business workflows.',
    url: '/',
    tags: ['profile', 'summary', 'senior', 'full stack', 'bahrain', 'manama', 'gmt+3', 'erp', '.net', 'sql server'],
    priority: 5,
    audience: ['recruiter', 'technical', 'general'],
    facts: ['16+ years experience', 'Based in Manama, Bahrain', 'Timezone GMT+3'],
  },
  {
    title: 'Contact',
    section: 'contact',
    content:
      'Email: hey@hellovg.win. Personal website: hellovg.win. GitHub: github.com/vimalgovind143. LinkedIn: linkedin.com/in/vimalgovind. X (Twitter): x.com/vimalgovind. Instagram: instagram.com/vimalgovind. Telephone listed on the CV is for reference only — prefer email for the fastest reply.',
    url: '/',
    tags: ['contact', 'email', 'hey@hellovg.win', 'github', 'linkedin', 'x', 'twitter', 'instagram', 'social'],
    priority: 4,
    audience: ['recruiter', 'technical', 'general'],
    facts: ['Email: hey@hellovg.win', 'Site: hellovg.win'],
  },

  // ──────────────────────────────────────────────────────────────
  // WORK HISTORY
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Current Role: Support Manager at Al Amthal Group',
    section: 'work',
    content:
      'Vimal is Support Manager at Al Amthal Group BSC Closed in Manama, Bahrain, from 2016 to current. He leads the software support and operations division, overseeing critical enterprise applications and infrastructure. Key wins include: architected and executed migration of legacy systems to modern cloud infrastructure with zero downtime, implementing automated deployment pipelines that reduced release cycles by 75%. Established proactive monitoring and incident management protocols, reducing critical system downtime by 90%. Expert in enterprise solutions including formula-based payroll, general ledger accounting, sales order management, microfinance platforms, and multi-warehouse inventory systems. Mentors technical teams and establishes best practices for system reliability and performance optimization.',
    url: '/about',
    tags: ['support manager', 'al amthal', 'current role', '2016', 'bahrain', 'downtime', 'release cycles', 'monitoring', 'erp', '.net', 'sql server'],
    priority: 5,
    audience: ['recruiter', 'technical'],
    facts: ['Support Manager since 2016', '75% reduction in release cycles', '90% reduction in critical system downtime', 'Migrated legacy to cloud with zero downtime'],
  },
  {
    title: 'Senior Software Engineer at Al Amthal Group (2012-2016)',
    section: 'work',
    content:
      'From 2012 to 2016, Vimal was Senior Software Engineer at Al Amthal Group BSC Closed, spearheading ERP product development initiatives focused on architectural design and feature implementation. He designed and implemented the core payroll engine handling complex tax calculations, statutory deductions, and multi-jurisdiction compliance across Middle Eastern markets. He architected the integrated accounting module supporting multi-company consolidation, with real-time general ledger processing and regulatory reporting. He led development of inventory management solutions with warehouse optimization, real-time tracking, and automated reordering capabilities. He established Clean Architecture patterns and code quality standards adopted across the development team.',
    url: '/about',
    tags: ['senior software engineer', 'al amthal', '2012', '2016', 'payroll', 'accounting', 'inventory', 'clean architecture', '.net', 'sql server', 'erp'],
    priority: 3,
    audience: ['recruiter', 'technical'],
    facts: ['Senior Software Engineer 2012-2016', 'Established Clean Architecture patterns'],
  },
  {
    title: 'Software Engineer at Al Amthal Group (2008-2012)',
    section: 'work',
    content:
      'From 2008 to 2012, Vimal was a Software Engineer at Al Amthal Group BSC Closed. Core development team member contributing to the design and implementation of ERP modules. Gained deep expertise in enterprise software architecture, database optimization, and business logic implementation across payroll, accounting, and inventory domains.',
    url: '/about',
    tags: ['software engineer', 'al amthal', '2008', '2012', 'junior', 'early career', 'erp', '.net', 'sql server'],
    priority: 2,
    audience: ['recruiter', 'technical'],
    facts: ['Software Engineer 2008-2012'],
  },

  // ──────────────────────────────────────────────────────────────
  // EDUCATION
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Education',
    section: 'education',
    content:
      "Vimal holds a Diploma in Software Engineering from NIIT, Bengaluru, India (2007-2008) and a Bachelor's Degree in Information Technology from MEA Engineering College, Kerala, India (2003-2007).",
    url: '/about',
    tags: ['education', 'degree', 'diploma', 'bachelor', 'niit', 'mea engineering college', 'india', 'kerala', 'bengaluru'],
    priority: 3,
    audience: ['recruiter'],
    facts: ['Diploma in Software Engineering, NIIT, 2007-2008', "Bachelor's in Information Technology, MEA Engineering College, 2003-2007"],
  },

  // ──────────────────────────────────────────────────────────────
  // ACHIEVEMENTS & NUMBERS (verbatim from resume-data.tsx)
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Achievements and Quantified Outcomes',
    section: 'achievements',
    content:
      "Quantified outcomes from Vimal's CV: led migration of legacy systems to modern cloud infrastructure with zero downtime and automated deployment pipelines that reduced release cycles by 75%. Proactive monitoring and incident management protocols reduced critical system downtime by 90%. Automated payroll cycles reduced processing time by 50% while maintaining 100% compliance with local labor laws and tax regulations. System modernization achieved 60% performance improvement and 75% reduction in deployment time. Across his career he has delivered 30+ enterprise projects across ERP domains and 16+ years of engineering experience.",
    url: '/about',
    tags: ['achievements', 'metrics', 'numbers', 'quantified', 'results', '75%', '90%', '50%', '60%', '100% compliance'],
    priority: 5,
    audience: ['recruiter'],
    facts: [
      '75% reduction in release cycles',
      '90% reduction in critical system downtime',
      '50% reduction in payroll processing time',
      '100% compliance with local labor laws and tax regulations',
      '60% performance improvement from system modernization',
      '75% reduction in deployment time',
      '16+ years engineering experience',
      '30+ projects shipped across ERP domains',
    ],
  },

  // ──────────────────────────────────────────────────────────────
  // RECRUITER FAQ
  // ──────────────────────────────────────────────────────────────
  {
    title: 'FAQ for Recruiters and Hiring Managers',
    section: 'faq',
    content:
      "Best fit for: senior backend, .NET Core, ERP modernization, SQL Server performance, and AI-assisted enterprise workflows. Vimal is strongest on long-running, support-heavy enterprise systems where reliability, observability, and clear architectural boundaries matter more than greenfield speed. Working hours overlap: GMT+3 (Bahrain), which gives good overlap with Europe mornings and US late mornings. Open to remote roles and to roles that allow occasional travel. For interview scheduling, role details, compensation, and visa/work-permit questions, email hey@hellovg.win with the role title, company, location, and the key tech stack — Vimal replies within a day. The /about page has the full CV and the /projects page has detailed project write-ups.",
    url: '/about',
    tags: ['faq', 'recruiter', 'hiring', 'interview', 'best fit', 'remote', 'availability', 'contact etiquette', 'gmt+3'],
    priority: 4,
    audience: ['recruiter'],
    facts: ['Best fit: senior backend, .NET Core, ERP modernization, SQL Server, AI workflows', 'Timezone: GMT+3', 'Open to remote roles'],
  },

  // ──────────────────────────────────────────────────────────────
  // SKILLS — GROUPED
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Backend Skills',
    section: 'skills',
    content:
      'Backend: .NET Core, ASP.NET, Entity Framework Core, REST APIs, Web APIs, SignalR, microservices architecture, Clean Architecture, SOLID principles, performance optimization, Git, Docker, Kubernetes, Azure, cloud infrastructure.',
    url: '/about',
    tags: ['backend', 'skills', '.net core', 'asp.net', 'entity framework', 'ef core', 'rest api', 'web api', 'signalr', 'microservices', 'clean architecture', 'solid', 'docker', 'kubernetes', 'azure', 'git'],
    priority: 4,
    audience: ['technical'],
  },
  {
    title: 'Frontend Skills',
    section: 'skills',
    content:
      'Frontend: React, Angular, TypeScript, JavaScript, HTML, CSS. Comfortable moving between modern React apps and legacy Angular codebases.',
    url: '/about',
    tags: ['frontend', 'skills', 'react', 'angular', 'typescript', 'javascript', 'html', 'css'],
    priority: 3,
    audience: ['technical'],
  },
  {
    title: 'Architecture Skills',
    section: 'skills',
    content:
      'Architecture: Clean Architecture, SOLID principles, microservices architecture, system architecture, performance optimization, emerging technologies evaluation.',
    url: '/about',
    tags: ['architecture', 'clean architecture', 'solid', 'microservices', 'system design', 'performance'],
    priority: 4,
    audience: ['technical'],
  },
  {
    title: 'Data and Infrastructure Skills',
    section: 'skills',
    content:
      'Data and infrastructure: SQL Server, database design, Docker, Kubernetes, Azure, cloud infrastructure, Git. Vimal has deep SQL Server experience — schema design, query optimization, indexing, and operational concerns (backups, replication, monitoring).',
    url: '/about',
    tags: ['data', 'infrastructure', 'sql server', 'mssql', 'database', 'docker', 'kubernetes', 'azure', 'cloud', 'git'],
    priority: 4,
    audience: ['technical'],
  },
  {
    title: 'Applied AI Skills',
    section: 'skills',
    content:
      'Applied AI: Semantic Kernel, Azure OpenAI, Microsoft.Extensions.AI, AI agents, function calling, RAG (retrieval-augmented generation), prompt engineering, machine learning fundamentals, data analysis. Vimal designs AI features for support-friendly automation — human-in-the-loop by default, with explicit handoff to email/operator when confidence is low.',
    url: '/about',
    tags: ['ai', 'semantic kernel', 'sk', 'azure openai', 'aoai', 'microsoft.extensions.ai', 'ai agents', 'function calling', 'rag', 'retrieval', 'prompt engineering', 'machine learning', 'data analysis'],
    priority: 5,
    audience: ['technical'],
  },
  {
    title: 'Business Domain Skills',
    section: 'skills',
    content:
      'Business domains: ERP systems, accounting systems, payroll systems, inventory management, business process analysis, enterprise software, formula-based payroll engines, multi-company general ledgers, warehouse operations, microfinance, loan management, regulatory reporting.',
    url: '/about',
    tags: ['business', 'domain', 'erp', 'accounting', 'payroll', 'inventory', 'microfinance', 'enterprise', 'business process'],
    priority: 4,
    audience: ['recruiter', 'technical'],
  },

  // ──────────────────────────────────────────────────────────────
  // PROJECTS — all 9 from resume-data.tsx
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Project: Semantic Kernel ERP Workflow Assistant (flagship AI project)',
    section: 'project',
    content:
      'Flagship AI project: a practical AI assistant concept for ERP workflows using Semantic Kernel native plugins, Azure OpenAI chat completion, and function calling. The assistant pattern focuses on support-friendly automation: retrieving customer balances, explaining payroll exceptions, drafting approval summaries, and routing operational requests with human review before sensitive actions. Tech stack: Semantic Kernel, Azure OpenAI, .NET Core, Function Calling, SQL Server. See the Semantic Kernel blog series (agents, plugins, production checklist) for production patterns.',
    url: '/projects',
    tags: ['semantic kernel', 'sk', 'azure openai', 'aoai', 'ai', 'agents', 'function calling', '.net core', 'sql server', 'erp', 'workflow', 'flagship', 'human in the loop'],
    priority: 5,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: Semantic Kernel, Azure OpenAI, .NET Core, Function Calling, SQL Server'],
  },
  {
    title: 'Project: Enterprise Payroll System',
    section: 'project',
    content:
      'Comprehensive payroll management system handling multi-company operations with complex tax calculations and statutory compliance. Formula-based salary computation engine supporting various compensation structures, allowances, deductions, and regulatory requirements across Middle Eastern markets. Automated payroll cycles reduced processing time by 50% while maintaining 100% compliance with local labor laws and tax regulations. Tech stack: ASP.NET Core, SQL Server, Entity Framework, REST APIs.',
    url: '/projects',
    tags: ['payroll', 'enterprise', 'tax', 'statutory', 'compliance', 'middle east', 'asp.net core', 'sql server', 'entity framework', 'rest api'],
    priority: 4,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, Entity Framework, REST APIs', '50% reduction in payroll processing time', '100% compliance'],
  },
  {
    title: 'Project: Integrated Accounting System',
    section: 'project',
    content:
      'Multi-company general ledger system with real-time transaction processing, inter-company reconciliation, and comprehensive financial reporting. Period-end closing automation, budget variance analysis, and compliance reporting for regulatory agencies. Supports concurrent user operations with transaction integrity and audit trail capabilities. Tech stack: ASP.NET Core, SQL Server, Entity Framework, Angular, REST APIs.',
    url: '/projects',
    tags: ['accounting', 'general ledger', 'gl', 'multi-company', 'reporting', 'audit', 'asp.net core', 'sql server', 'entity framework', 'angular', 'rest api'],
    priority: 4,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, Entity Framework, Angular, REST APIs'],
  },
  {
    title: 'Project: Inventory Management Platform',
    section: 'project',
    content:
      'Scalable inventory management system featuring real-time stock tracking across multiple warehouses, automated reordering with safety stock calculations, and comprehensive inventory reporting. Demand forecasting algorithms to optimize stock levels and reduce carrying costs. Real-time synchronization ensures accurate inventory visibility across all business units. Tech stack: ASP.NET Core, SQL Server, REST APIs.',
    url: '/projects',
    tags: ['inventory', 'warehouse', 'stock', 'forecasting', 'real-time', 'asp.net core', 'sql server', 'rest api'],
    priority: 3,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, REST APIs'],
  },
  {
    title: 'Project: Microfinance Management System',
    section: 'project',
    content:
      'Comprehensive microfinance platform with advanced loan management, customizable repayment schedules, and borrower portfolio tracking. Credit assessment algorithms, collateral management, loan disbursement workflows, and regulatory compliance reporting. Handles complex lending scenarios with automated payment reconciliation and comprehensive audit trails. Tech stack: ASP.NET, SQL Server, Entity Framework, REST APIs, Angular.',
    url: '/projects',
    tags: ['microfinance', 'loans', 'lending', 'credit', 'collateral', 'disbursement', 'reconciliation', 'asp.net', 'sql server', 'entity framework', 'angular', 'rest api'],
    priority: 3,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: ASP.NET, SQL Server, Entity Framework, REST APIs, Angular'],
  },
  {
    title: 'Project: Enterprise Trading and Sales Management Platform',
    section: 'project',
    content:
      'Sophisticated trading and sales platform with dynamic contract management, formula-based pricing engines, and advanced billing capabilities. Customizable contract templates with version control, real-time market data integration, multi-currency support, and automated billing cycles. Comprehensive financial reporting and settlement management for complex trade transactions. Tech stack: ASP.NET Core, SQL Server, Angular, Redis, Web APIs.',
    url: '/projects',
    tags: ['trading', 'sales', 'contracts', 'pricing', 'billing', 'multi-currency', 'settlement', 'asp.net core', 'sql server', 'angular', 'redis', 'web api'],
    priority: 3,
    audience: ['recruiter', 'technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, Angular, Redis, Web APIs'],
  },
  {
    title: 'Project: System Modernization: Legacy to .NET Core',
    section: 'project',
    content:
      'Led comprehensive modernization of legacy ERP systems to .NET Core architecture, implementing Clean Architecture principles and microservices patterns. Successfully migrated monolithic applications to distributed system design with containerization and cloud deployment. Achieved 60% performance improvement and 75% reduction in deployment time, with significantly improved system maintainability and scalability. Tech stack: ASP.NET Core, Entity Framework Core, Clean Architecture, Microservices, Docker, Azure.',
    url: '/projects',
    tags: ['modernization', 'legacy', 'migration', '.net core', 'clean architecture', 'microservices', 'docker', 'azure', 'containers', 'monolith'],
    priority: 4,
    audience: ['technical'],
    facts: ['Tech: ASP.NET Core, Entity Framework Core, Clean Architecture, Microservices, Docker, Azure', '60% performance improvement', '75% reduction in deployment time'],
  },
  {
    title: 'Project: Document Processing and Workflow Automation',
    section: 'project',
    content:
      'Enterprise document processing system for automated routing, approval workflows, and business rule execution. Intelligent form processing with validation rules, automated approval routing based on document criteria, and comprehensive audit logging. Streamlined document-intensive processes and reduced manual processing overhead significantly. Tech stack: ASP.NET Core, SQL Server, Angular, REST APIs, Business Rules Engine.',
    url: '/projects',
    tags: ['document processing', 'workflow', 'automation', 'approval', 'business rules', 'audit', 'asp.net core', 'sql server', 'angular', 'rest api'],
    priority: 3,
    audience: ['technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, Angular, REST APIs, Business Rules Engine'],
  },
  {
    title: 'Project: Real-Time Analytics and Reporting Dashboard',
    section: 'project',
    content:
      'Comprehensive business intelligence platform providing real-time dashboards, executive reporting, and operational analytics. Efficient data aggregation pipelines, interactive visualizations, and ad-hoc reporting capabilities. Enables data-driven decision-making with performance metrics, trend analysis, and business KPI tracking. Tech stack: ASP.NET Core, SQL Server, Data Analytics.',
    url: '/projects',
    tags: ['analytics', 'reporting', 'dashboard', 'bi', 'business intelligence', 'kpi', 'real-time', 'asp.net core', 'sql server', 'data analytics'],
    priority: 3,
    audience: ['technical'],
    facts: ['Tech: ASP.NET Core, SQL Server, Data Analytics'],
  },
  {
    title: 'Project: Semantic Kernel Production Checklist (blog-driven project)',
    section: 'project',
    content:
      'A practical, blog-driven production checklist for shipping Semantic Kernel agents in enterprise .NET applications. Covers plugin design, function-calling guardrails, retrieval patterns (RAG), observability, evaluation, and rollout. Backed by three blog posts: semantic-kernel-plugins-for-erp-workflows, semantic-kernel-dotnet-enterprise-ai-agents, and semantic-kernel-production-checklist-dotnet.',
    url: '/blog',
    tags: ['semantic kernel', 'sk', 'production', 'checklist', 'plugins', 'rag', 'enterprise', '.net', 'ai', 'observability'],
    priority: 3,
    audience: ['technical'],
  },

  // ──────────────────────────────────────────────────────────────
  // BLOG
  // ──────────────────────────────────────────────────────────────
  {
    title: 'Flagship Blog Posts',
    section: 'blog',
    content:
      'Flagship posts on the /blog page: a Semantic Kernel trilogy for .NET enterprise AI agents (semantic-kernel-dotnet-enterprise-ai-agents, semantic-kernel-plugins-for-erp-workflows, semantic-kernel-production-checklist-dotnet), Clean Architecture in .NET, CQRS with MediatR in .NET, ASP.NET Core API patterns, EF Core production pitfalls, SQL Server performance and indexing in production, multi-tenant ERP in .NET, monolith to microservices for ERP, and a 16-year retrospective on enterprise software lessons.',
    url: '/blog',
    tags: ['blog', 'flagship', 'semantic kernel', 'clean architecture', 'cqrs', 'asp.net core', 'ef core', 'sql server', 'multi-tenant', 'microservices'],
    priority: 4,
    audience: ['technical'],
  },
  {
    title: 'Supporting Blog Posts',
    section: 'blog',
    content:
      'Supporting posts: practical AI in enterprise apps, AI code review assistant, Node.js best practices, React hooks guide, React performance for dashboards, TypeScript patterns, Dockerizing legacy .NET, Azure vs self-hosted ERP, vibe coding myths and facts, plus a couple of welcome posts.',
    url: '/blog',
    tags: ['blog', 'supporting', 'react', 'typescript', 'node.js', 'docker', 'azure', 'vibe coding'],
    priority: 2,
    audience: ['technical'],
  },
];
