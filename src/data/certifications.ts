export interface CertificationGroup {
  title: string;
  items: string[];
}

export const certifications: CertificationGroup[] = [
  {
    title: 'Completed',
    items: [
      'Full Stack Web Development — Andela (2024)',
      'JavaScript Algorithms & Data Structures — freeCodeCamp',
      'Responsive Web Design — freeCodeCamp',
      'Git & GitHub Mastery — Practical Training',
    ],
  },
  {
    title: 'In progress',
    items: [
      'AWS Cloud Practitioner Certification',
      'Advanced React Patterns & Performance',
      'System Design for Scalable Applications',
      'DevOps Fundamentals with Docker & Kubernetes',
    ],
  },
  {
    title: 'Learning goals',
    items: [
      'Cloud architecture (AWS / Azure)',
      'Advanced TypeScript & design patterns',
      'Mobile development with React Native',
      'AI/ML integration in web applications',
    ],
  },
];
