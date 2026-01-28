
import { Job } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Software Engineering Intern',
    company: 'WSO2',
    location: 'Colombo, Sri Lanka',
    type: 'Internship',
    salary: 'Rs. 40,000 - 60,000',
    description: 'Join the world-class engineering team at WSO2. Work on open-source projects, cloud architecture, and enterprise integration patterns. Ideal for final-year undergraduates.',
    category: 'Software Development',
    postedAt: '2024-05-10',
    logo: 'https://picsum.photos/seed/wso2/100/100'
  },
  {
    id: '2',
    title: 'Associate UI/UX Designer',
    company: '99x',
    location: 'Remote / Colombo',
    type: 'Full-time',
    salary: 'Negotiable',
    description: 'We are looking for a creative UI/UX designer to craft beautiful digital experiences for our European clients. Proficiency in Figma and Adobe Creative Cloud is required.',
    category: 'UI/UX Design',
    postedAt: '2024-05-12',
    logo: 'https://picsum.photos/seed/99x/100/100'
  },
  {
    id: '3',
    title: 'Data Analyst Trainee',
    company: 'Sysco LABS',
    location: 'Colombo 07',
    type: 'Internship',
    salary: 'Rs. 35,000',
    description: 'Dive deep into retail data. Help us optimize supply chain operations for the world\'s largest foodservice distributor. SQL and Python knowledge preferred.',
    category: 'Data Science',
    postedAt: '2024-05-14',
    logo: 'https://picsum.photos/seed/sysco/100/100'
  },
  {
    id: '4',
    title: 'Junior QA Engineer',
    company: 'Pearson Lanka',
    location: 'Colombo',
    type: 'Full-time',
    salary: 'Competitive',
    description: 'Ensuring quality in educational software. You will be responsible for manual and automated testing of web-based learning platforms.',
    category: 'Software Development',
    postedAt: '2024-05-15',
    logo: 'https://picsum.photos/seed/pearson/100/100'
  }
];
