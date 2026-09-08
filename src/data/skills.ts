export interface SkillCategory {
  name: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    name: 'Frontend',
    items: ['React.js / Next.js', 'TypeScript / JavaScript', 'HTML5 / CSS3 / Tailwind', 'Redux / Context API'],
  },
  {
    name: 'Backend',
    items: ['Node.js / Express.js', 'NestJS', 'Java Spring Boot', 'PHP', 'REST APIs / JWT'],
  },
  {
    name: 'Database',
    items: ['PostgreSQL', 'MySQL', 'MongoDB'],
  },
  {
    name: 'DevOps & Tools',
    items: ['Docker', 'Git / GitHub', 'Vite / Webpack', 'CI/CD basics', 'Stripe'],
  },
];
