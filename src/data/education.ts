export interface EducationItem {
  degree: string;
  institution: string;
  detail?: string;
  period: string;
  highlights: string[];
}

export const education: EducationItem[] = [
  {
    degree: 'Bachelor of Computer Science',
    institution: 'Kigali Independent University – Gisenyi Campus',
    period: '2022 – 2024',
    highlights: [
      'Specialized in Software Engineering and System Development',
      'Leadership role as Minister of ICT',
      'Focus on practical problem-solving with technology',
    ],
  },
  {
    degree: 'A2 in MPG',
    institution: 'Collège De La Paix',
    detail: 'Mathematics, Physics, Geography',
    period: '2018 – 2021',
    highlights: [
      'Strong foundation in analytical and problem-solving skills',
      'Mathematical and logical thinking development',
    ],
  },
];
