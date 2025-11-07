import { LucideIcon } from "lucide-react";

export interface WorkExperience {
  company: string;
  link: string;
  badges: string[];
  title: string;
  logo?: string;
  start: string;
  end: string;
  description: string;
  techStack?: string[];
}

export interface Project {
  title: string;
  techStack: string[];
  description: string;
  image?: string;
  link?: {
    label: string;
    href: string;
  };
}

export interface Education {
  school: string;
  degree: string;
  start: string;
  end: string;
  description?: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
}

export interface Contact {
  email: string;
  tel?: string;
  social: SocialLink[];
}

export interface ResumeData {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl?: string;
  contact: Contact;
  education: Education[];
  work: WorkExperience[];
  skills: string[];
  projects: Project[];
}
