
export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  bio?: string;
  skills: string[];
  avatar: string;
  role: 'student' | 'employer';
  applications: JobApplication[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  languages: string[];
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  link?: string;
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  INTERVIEWING = 'Interviewing',
  OFFERED = 'Offered',
  REJECTED = 'Rejected'
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo: string;
  status: ApplicationStatus;
  appliedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Internship' | 'Full-time' | 'Contract' | 'Remote';
  salary?: string;
  description: string;
  category: string;
  postedAt: string;
  logo: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export enum JobCategory {
  SOFTWARE = 'Software & IT',
  HEALTHCARE = 'Healthcare & Medicine',
  FINANCE = 'Finance & Banking',
  EDUCATION = 'Education & teaching',
  ENGINEERING = 'Engineering & Construction',
  HOSPITALITY = 'Hospitality & Tourism',
  CREATIVE = 'Creative & Design',
  MARKETING = 'Marketing & Sales',
  MANAGEMENT = 'Management & HR',
  OTHER = 'General & Other'
}
