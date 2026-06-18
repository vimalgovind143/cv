import { AmthalLogo } from '@/images/logos';
import { GitHubIcon, LinkedInIcon, XIcon, IGIcon } from '@/components/icons';
import type { ResumeData } from '@/types/resume';

export const RESUME_DATA: ResumeData = {
  name: 'Mr Vimal Govind Markkasseri',
  initials: 'VG',
  location: 'Manama, Bahrain GMT+3',
  locationLink: 'https://www.google.com/maps/place/bahrain',
  about:
    'Senior Full Stack Engineer focused on building reliable enterprise systems, modernizing legacy platforms, and adding practical AI capabilities with tools such as Semantic Kernel and Azure OpenAI.',
  summary:
    'Full Stack Engineer with 16+ years of experience delivering enterprise ERP solutions end-to-end. My work spans .NET/Core, SQL, modern web technologies, cloud infrastructure, and applied AI, with a focus on clarity, reliability, and long-term maintainability. I enjoy partnering with cross-functional teams to modernize legacy systems, improve performance, and simplify complex business workflows. Lately, I’ve been especially interested in practical AI agents and workflow automation with Semantic Kernel, Azure OpenAI, native plugins, and retrieval patterns that enhance real products without overcomplicating the solution.',
  avatarUrl: 'https://avatars.githubusercontent.com/u/72629651?v=4',
  personalWebsiteUrl: 'https://hellovg.win',
  contact: {
    email: 'hey@hellovg.win',
    tel: '+973364AB541',
    social: [
      {
        name: 'GitHub',
        url: 'https://github.com/vimalgovind143',
        icon: GitHubIcon,
      },
      {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/vimalgovind/',
        icon: LinkedInIcon,
      },
      {
        name: 'X',
        url: 'https://x.com/vimalgovind',
        icon: XIcon,
      },
      {
        name: 'Instagram',
        url: 'https://instagram.com/vimalgovind',
        icon: IGIcon,
      },
    ],
  },
  education: [
    {
      school: 'NIIT, Bengaluru, India',
      degree: 'Diploma in Software Engineering',
      start: '2007',
      end: '2008',
    },
    {
      school: 'MEA Engineering College, Kerala, India',
      degree: "Bachelor's Degree in Information Technology",
      start: '2003',
      end: '2007',
    },
  ],
  work: [
    {
      company: 'Al Amthal Group BSC Closed, Manama, Bahrain',
      badges: ['Full-Time'],
      title: 'Support Manager',
      logo: AmthalLogo,
      start: '2016',
      end: 'Current',
      description:
        'Lead the software support and operations division, overseeing critical enterprise applications and infrastructure. Key responsibilities include:' +
        ' Architected and executed migration of legacy systems to modern cloud infrastructure with zero downtime, implementing automated deployment pipelines that reduced release cycles by 75%.' +
        ' Established proactive monitoring and incident management protocols, reducing critical system downtime by 90%.' +
        ' Expert in enterprise solutions including formula-based payroll, general ledger accounting, sales order management, microfinance platforms, and multi-warehouse inventory systems.' +
        ' Mentored technical teams and established best practices for system reliability and performance optimization.',
    },
    {
      company: 'Al Amthal Group BSC Closed, Manama, Bahrain',
      badges: ['Full-Time'],
      title: 'Senior Software Engineer',
      logo: AmthalLogo,
      start: '2012',
      end: '2016',
      description:
        'Spearheaded ERP product development initiatives, focusing on architectural design and feature implementation. Notable contributions include:' +
        ' Designed and implemented core payroll engine handling complex tax calculations, statutory deductions, and multi-jurisdiction compliance across Middle Eastern markets.' +
        ' Architected integrated accounting module supporting multi-company consolidation, with real-time general ledger processing and regulatory reporting.' +
        ' Led development of inventory management solutions with warehouse optimization, real-time tracking, and automated reordering capabilities.' +
        ' Established Clean Architecture patterns and code quality standards adopted across the development team.',
    },
    {
      company: 'Al Amthal Group BSC Closed, Manama, Bahrain',
      badges: ['Full-Time'],
      title: 'Software Engineer',
      logo: AmthalLogo,
      start: '2008',
      end: '2012',
      description:
        'Core development team member contributing to the design and implementation of ERP modules. Gained deep expertise in enterprise software architecture, database optimization, and business logic implementation across payroll, accounting, and inventory domains.',
    },
  ],
  skills: [
    '.NET Core',
    'ASP.NET',
    'Entity Framework Core',
    'HTML/CSS',
    'JavaScript',
    'React',
    'Angular',
    'TypeScript',
    'REST APIs',
    'Web APIs',
    'SignalR',
    'Microservices Architecture',
    'Clean Architecture',
    'SOLID Principles',
    'Docker',
    'Kubernetes',
    'Azure',
    'Cloud Infrastructure',
    'Git',
    'SQL Server',
    'Database Design',
    'System Architecture',
    'ERP Systems',
    'Enterprise Software',
    'Accounting Systems',
    'Payroll Systems',
    'Inventory Management',
    'Business Process Analysis',
    'Performance Optimization',
    'Emerging Technologies',
    'Semantic Kernel',
    'Azure OpenAI',
    'Microsoft.Extensions.AI',
    'AI Agents',
    'Function Calling',
    'RAG',
    'Prompt Engineering',
    'Artificial Intelligence (AI)',
    'Machine Learning Fundamentals',
    'Data Analysis',
  ],
  projects: [
    {
      title: 'Semantic Kernel ERP Workflow Assistant',
      techStack: ['Semantic Kernel', 'Azure OpenAI', '.NET Core', 'Function Calling', 'SQL Server'],
      description:
        'Designed a practical AI assistant concept for ERP workflows using Semantic Kernel native plugins, Azure OpenAI chat completion, and function calling. The assistant pattern focuses on support-friendly automation such as retrieving customer balances, explaining payroll exceptions, drafting approval summaries, and routing operational requests with human review before sensitive actions.',
      logo: AmthalLogo,
    },
    {
      title: 'Enterprise Payroll System',
      techStack: ['ASP.NET Core', 'SQL Server', 'Entity Framework', 'REST APIs'],
      description:
        'Developed and maintained a comprehensive payroll management system handling multi-company operations with complex tax calculations and statutory compliance. Implemented formula-based salary computation engine supporting various compensation structures, allowances, deductions, and regulatory requirements across Middle Eastern markets. Automated payroll cycles reduced processing time by 50% while maintaining 100% compliance with local labor laws and tax regulations.',
      logo: AmthalLogo,
    },
    {
      title: 'Integrated Accounting System',
      techStack: ['ASP.NET Core', 'SQL Server', 'Entity Framework', 'Angular', 'REST APIs'],
      description:
        'Architected multi-company general ledger system with real-time transaction processing, inter-company reconciliation, and comprehensive financial reporting. Implemented sophisticated features including period-end closing automation, budget variance analysis, and compliance reporting for regulatory agencies. The system supports concurrent user operations with transaction integrity and audit trail capabilities.',
      logo: AmthalLogo,
    },
    {
      title: 'Inventory Management Platform',
      techStack: ['ASP.NET Core', 'SQL Server', 'REST APIs'],
      description:
        'Built a scalable inventory management system featuring real-time stock tracking across multiple warehouses, automated reordering with safety stock calculations, and comprehensive inventory reporting. Implemented demand forecasting algorithms to optimize stock levels and reduce carrying costs. Real-time synchronization ensures accurate inventory visibility across all business units.',
      logo: AmthalLogo,
    },
    {
      title: 'Microfinance Management System',
      techStack: ['ASP.NET', 'SQL Server', 'Entity Framework', 'REST APIs', 'Angular'],
      description:
        'Developed a comprehensive microfinance platform with advanced loan management, customizable repayment schedules, and borrower portfolio tracking. Implemented sophisticated features including credit assessment algorithms, collateral management, loan disbursement workflows, and regulatory compliance reporting. The system handles complex lending scenarios with automated payment reconciliation and comprehensive audit trails.',
      logo: AmthalLogo,
    },
    {
      title: 'Enterprise Trading & Sales Management Platform',
      techStack: ['ASP.NET Core', 'SQL Server', 'Angular', 'Redis', 'Web APIs'],
      description:
        'Architected a sophisticated trading and sales platform with dynamic contract management, formula-based pricing engines, and advanced billing capabilities. Implemented customizable contract templates with version control, real-time market data integration, multi-currency support, and automated billing cycles. The system provides comprehensive financial reporting and settlement management for complex trade transactions.',
      logo: AmthalLogo,
    },
    {
      title: 'System Modernization: Legacy to .NET Core',
      techStack: [
        'ASP.NET Core',
        'Entity Framework Core',
        'Clean Architecture',
        'Microservices',
        'Docker',
        'Azure',
      ],
      description:
        'Led comprehensive modernization of legacy ERP systems to .NET Core architecture, implementing Clean Architecture principles and microservices patterns. Successfully migrated monolithic applications to distributed system design with containerization and cloud deployment. Achieved 60% performance improvement, 75% reduction in deployment time, and significantly improved system maintainability and scalability.',
      logo: AmthalLogo,
    },
    {
      title: 'Document Processing & Workflow Automation',
      techStack: ['ASP.NET Core', 'SQL Server', 'Angular', 'REST APIs', 'Business Rules Engine'],
      description:
        'Built an enterprise document processing system for automated routing, approval workflows, and business rule execution. Implemented intelligent form processing with validation rules, automated approval routing based on document criteria, and comprehensive audit logging. The system streamlined document-intensive processes and reduced manual processing overhead significantly.',
      logo: AmthalLogo,
    },
    {
      title: 'Real-Time Analytics & Reporting Dashboard',
      techStack: ['ASP.NET Core', 'SQL Server', 'Data Analytics'],
      description:
        'Developed a comprehensive business intelligence platform providing real-time dashboards, executive reporting, and operational analytics. Implemented efficient data aggregation pipelines, interactive visualizations, and ad-hoc reporting capabilities. The system enables data-driven decision-making with performance metrics, trend analysis, and business KPI tracking.',
      logo: AmthalLogo,
    },
  ],
} as const satisfies ResumeData;
