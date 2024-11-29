import { AmthalLogo } from '@/images/logos';
import { GitHubIcon, LinkedInIcon, XIcon, IGIcon } from '@/components/icons';

export const RESUME_DATA = {
  name: 'Vimal Govind Markkasseri',
  initials: 'Mr.',
  location: 'Manama, Bahrain GMT+3',
  locationLink: 'https://www.google.com/maps/place/bahrain',
  about:
    'Senior Full Stack Engineer specializing in enterprise software development and technical leadership.',
  summary:
    'A seasoned Full Stack Engineer with over 16 years of experience in architecting and delivering enterprise-level ERP solutions. My core expertise encompasses .NET Core, SQL, and modern web technologies including React and Angular. I excel in leading development teams and implementing complex business solutions, with particular focus on ERP systems for financial management, payroll, and inventory control. My approach combines technical excellence with a strong emphasis on delivering measurable business value.',
  avatarUrl: 'https://cdn2.mallats.com/AmthalGroup/img/team/Vimal.jpg',
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
      company: 'Al Amthal Group BSC Closed, Manama Bahrain',
      link: 'https://amthalgroup.com',
      badges: ['Full-Time'],
      title: 'Support Manager',
      logo: AmthalLogo,
      start: '2016',
      end: 'Current',
      description:
        'Lead the software support division, managing critical enterprise applications and driving system improvements. Key achievements include:' +
        ' Successfully migrated legacy systems to modern cloud infrastructure, implemented automated deployment processes, and reduced support response time by 40%.' +
        ' Expert in enterprise solutions including payroll, accounting, sales, and inventory management systems.',
    },
    {
      company: 'Al Amthal Group BSC Closed, Manama Bahrain',
      link: 'https://amthalgroup.com',
      badges: ['Full-Time'],
      title: 'Senior Software Engineer',
      logo: AmthalLogo,
      start: '2012',
      end: 2016,
      description:
        'Spearheaded ERP software development initiatives, focusing on new feature development and system architecture. Notable contributions include:' +
        ' Designed and implemented core modules for payroll and accounting systems, resulting in 30% improved processing efficiency.' +
        ' Led the development of integrated inventory management solutions for enterprise clients.',
    },
  ],
  skills: [
    '.NET Core',
    'asp.net',
    'SQL/MSSQL',
    'html/css',
    'angular',
    'react',
    'ERP',
    'Accounting',
    'Api',
    'Microservices',
    'Clean Architecture',
    'Docker',
    'Kubernetes',
    'Azure',
    'SQL Server',
    'Entity Framework Core',
    'SignalR',
    'Web APIs',
    'REST APIs',
    'Git',
  ],
  projects: [
    {
      title: 'Migration to .NET Core',
      techStack: ['ASP.NET Core', 'EF Core', 'REST APIs', 'Clean Architecture'],
      description:
        'Led the modernization of legacy ERP systems to .NET Core, implementing Clean Architecture principles. Key achievements include:' +
        ' Successfully designed and implemented a scalable microservices architecture, improved system performance by 60%, and reduced deployment time by 75%.',
      logo: AmthalLogo,
      link: {
        label: 'amthalgroup.com',
        href: 'https://www.amthalgroup.com',
      },
    },
    {
      title: 'Enterprise Payroll System',
      techStack: ['ASP.NET Core', 'SQL Server', 'JavaScript', 'REST APIs'],
      description:
        'Developed and maintained a comprehensive payroll management system handling multi-company operations, tax calculations, and regulatory compliance across Middle Eastern markets. Implemented automated workflows reducing payroll processing time by 50% and ensuring 100% compliance with local labor laws.',
      logo: AmthalLogo,
      link: {
        label: 'amthalgroup.com',
        href: 'https://www.amthalgroup.com',
      },
    },
    {
      title: 'Integrated Inventory Management',
      techStack: ['ASP.NET Core', 'SQL Server', 'JavaScript', 'React'],
      description:
        'Built a scalable inventory management system featuring real-time tracking, automated reordering, and comprehensive reporting capabilities. Integrated seamlessly with existing ERP modules',
      logo: AmthalLogo,
      link: {
        label: 'amthalgroup.com',
        href: 'https://www.amthalgroup.com',
      },
    },
    {
      title: 'Microfinance Management System',
      techStack: ['ASP.NET', 'SQL Server', 'Entity Framework', 'REST APIs'],
      description:
        'Developed a comprehensive microfinance system with advanced loan management, automated repayment scheduling, and customer portfolio tracking. Implemented sophisticated features including risk assessment algorithms, collateral management, and regulatory compliance reporting, compliance-related issues.',
      logo: AmthalLogo,
      link: {
        label: 'amthalgroup.com',
        href: 'https://www.amthalgroup.com',
      },
    },
    {
      title: 'Enterprise Trading & Sales Management',
      techStack: ['ASP.NET Core', 'SQL Server', 'SignalR', 'Web APIs', 'Angular', 'Redis'],
      description:
        'Architected a sophisticated trading and sales platform with dynamic contract management and advanced billing capabilities. Implemented key features including:' +
        ' Customizable contract templates with version control, formula-based pricing engine with real-time market data integration, automated billing cycles with multi-currency support, and comprehensive financial reporting.',
      logo: AmthalLogo,
      link: {
        label: 'amthalgroup.com',
        href: 'https://www.amthalgroup.com',
      },
    },
  ],
} as const;
