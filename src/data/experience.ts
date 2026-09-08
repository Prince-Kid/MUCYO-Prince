export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  arrangement?: string;
  highlights: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: 'Full-Stack Software Developer',
    company: 'HireMe Afrika',
    period: 'Nov 2025 – Present',
    arrangement: 'Hybrid full-time',
    highlights: [
      'Developing and maintaining the HireMe Afrika recruitment platform with Next.js and Java Spring Boot',
      'Implementing microservices architecture to improve scalability and performance',
      'Designing and integrating RESTful APIs across services with product and engineering teams',
    ],
  },
  {
    role: 'Founding Software Developer',
    company: 'Nextline Homes (Nextline Hub)',
    period: 'Nov 2025 – Present',
    arrangement: 'Remote',
    highlights: [
      'Building the Nextline real estate platform from the ground up for owners, agents, and tenants',
      'Developing React/Next.js interfaces and NestJS REST APIs for listings and property workflows',
      'Designing database schemas, auth, and search/filter features for property datasets',
    ],
  },
  {
    role: 'Full-Stack Software Developer & Trainer',
    company: 'HB Lab',
    period: 'May 2025 – Nov 2025',
    highlights: [
      'Developing custom software solutions tailored to client needs',
      'Delivering training sessions in software development and digital skills',
      'Supporting community initiatives to promote ICT awareness and young tech talent',
    ],
  },
  {
    role: 'Software Developer',
    company: 'GOPE Ltd',
    period: 'Dec 2024 – Present',
    highlights: [
      'Developing enterprise-level software solutions',
      'Working with modern tech stacks and agile methodologies',
      'Contributing to system architecture and design decisions',
    ],
  },
  {
    role: 'Trainee Full Stack Developer',
    company: 'Andela',
    period: 'Feb 2024 – Dec 2024',
    highlights: [
      'Intensive training in full-stack development',
      'Built scalable web applications using PERN/MERN stacks',
      'Collaborative development and code review practices',
    ],
  },
  {
    role: 'Software Development Trainee',
    company: 'Hanga Hub, Rubavu',
    period: 'Jul 2024 – Dec 2024',
    highlights: [
      'Hands-on experience with real-world projects',
      'Mentorship in software development best practices',
      'Community-driven tech innovation initiatives',
    ],
  },
];
