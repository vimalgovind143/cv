import {
  AmbitLogo,
  BarepapersLogo,
  BimLogo,
  CDGOLogo,
  ClevertechLogo,
  ConsultlyLogo,
  EvercastLogo,
  Howdy,
  JarockiMeLogo,
  JojoMobileLogo,
  Minimal,
  MobileVikingsLogo,
  MonitoLogo,
  NSNLogo,
  ParabolLogo,
  TastyCloudLogo,
  YearProgressLogo,
} from "@/images/logos";
import { GitHubIcon, LinkedInIcon, XIcon } from "@/components/icons";

export const RESUME_DATA = {
  name: "Vimal Govind Markkasseri",
  initials: "M",
  location: "Manama, Bahrain",
  locationLink: "https://www.google.com/maps/place/Manama,+Bahrain/",
  about:
    "Full Stack Engineer focused on building products with extra attention to detail",
  summary:
    "With over 14 years of experience in software development, I am a Certified Microsoft Solution Architect and a Software Support Manager at Amthal Group, a leading provider of IT solutions in the Middle East. I specialize in engineering and supporting high-quality software solutions using Microsoft technologies, such as .NET Core, ASP.NET, C#, MVC, and SQL Server. <br/> At Amthal Group, I lead the optimization, and migration of various ERP projects, leveraging my deep knowledge and systematic approach to streamline business processes and drive enterprise growth. I also harness the power of cloud computing, using Azure services such as Azure DevOps, Azure Functions, and infrastructure as code, to enhance applications with scalability, resilience, and modern architectures. Additionally, I am passionate about exploring the disruptive and innovative potential of blockchain and cryptocurrency.",
  avatarUrl: "https://avatars.githubusercontent.com/u/72629651?v=4",
  personalWebsiteUrl: "https://hellovg.me",
  contact: {
    email: "vimalgovind@live.in",
    tel: "+97336497541",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/vimalgovind143",
        icon: GitHubIcon,
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/vimalgovind/",
        icon: LinkedInIcon,
      },
      {
        name: "X",
        url: "https://x.com/vimalgovind",
        icon: XIcon,
      },
    ],
  },
  education: [
    {
      school: "MEA Engineering College, Malappuram",
      degree: "Engineering in Information Technology",
      start: "2003",
      end: "2007",
    },
  ],
  work: [
    {
      company: "Amthal Group BSC Closed",
      link: "https://amthalgroup.com",
      badges: ["Full Stack Developer"],
      title: "Developer",
      logo: ParabolLogo,
      start: "2008",
      end: "2013",
      description:
        "Implemented new features, led squad, worked on improving the way developers ship the code, started migration from Emotion to Tailwind CSS and more. Technologies: React, TypeScript, GraphQL",
    },
  ],
  skills: [
    ".net core",
    "asp.net",
    "JavaScript",
    "Node.js",
    "GraphQL",
    "Relay",
    "WebRTC",
  ],
  projects: [
    {
      title: "Optimum ERP",
      techStack: [
        "Asp.Net",
        "Html",
        "javascript",
        "MS SQL",
      ],
      description: "ERP for Amthal Group",
      logo: ConsultlyLogo,
      link: {
        label: "amthalgroup.com",
        href: "https://amthalgroup.com/",
      },
    },
    ,
  ],
} as const;
