
export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  bio?: string;
  skills: string[];
  avatar: string;
  role: 'student' | 'employer';
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
  SOFTWARE = 'Software Development',
  DATA = 'Data Science',
  DESIGN = 'UI/UX Design',
  MARKETING = 'Marketing',
  MANAGEMENT = 'Management',
  OTHER = 'Other'
}
