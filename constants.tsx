
import { Job, JobCategory } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Management Trainee - Banking',
    company: 'Commercial Bank of Ceylon',
    location: 'Colombo 01',
    type: 'Full-time',
    salary: 'Attractive Package',
    description: 'Launch your banking career with the leading private bank in Sri Lanka. We are looking for high-achieving graduates for our management trainee program.',
    category: JobCategory.FINANCE,
    postedAt: '2024-05-18',
    logo: 'https://picsum.photos/seed/combank/100/100'
  },
  {
    id: '2',
    title: 'Assistant Lecturer (English)',
    company: 'Horizon Campus',
    location: 'Malabe',
    type: 'Full-time',
    salary: 'Negotiable',
    description: 'Passionate educators wanted to join our Faculty of Education. Help shape the next generation of students in a dynamic academic environment.',
    category: JobCategory.EDUCATION,
    postedAt: '2024-05-19',
    logo: 'https://picsum.photos/seed/horizon/100/100'
  },
  {
    id: '3',
    title: 'Nursing Intern',
    company: 'Asiri Health',
    location: 'Colombo / Kandy',
    type: 'Internship',
    salary: 'Stipend provided',
    description: 'Gain hands-on experience in one of the most technologically advanced private healthcare providers in the country. Open to final-year nursing students.',
    category: JobCategory.HEALTHCARE,
    postedAt: '2024-05-20',
    logo: 'https://picsum.photos/seed/asiri/100/100'
  },
  {
    id: '4',
    title: 'Front Office Associate',
    company: 'Shangri-La Colombo',
    location: 'Colombo 02',
    type: 'Full-time',
    salary: 'Standard Industry Rates',
    description: 'Represent the finest hospitality in the heart of the city. We seek energetic individuals with excellent communication skills and a service-oriented mindset.',
    category: JobCategory.HOSPITALITY,
    postedAt: '2024-05-21',
    logo: 'https://picsum.photos/seed/shangri/100/100'
  },
  {
    id: '5',
    title: 'Junior Civil Engineer',
    company: 'Access Engineering PLC',
    location: 'Islandwide Projects',
    type: 'Full-time',
    salary: 'Competitive',
    description: 'Join the premier engineering firm in Sri Lanka. Work on landmark infrastructure projects that define our nation\'s landscape.',
    category: JobCategory.ENGINEERING,
    postedAt: '2024-05-22',
    logo: 'https://picsum.photos/seed/access/100/100'
  }
];
