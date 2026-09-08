export interface LeadershipItem {
  title: string;
  org: string;
  period?: string;
  highlights: string[];
}

export const leadership: LeadershipItem[] = [
  {
    title: 'Minister of ICT',
    org: 'Kigali Independent University',
    period: 'Aug 2023 – Aug 2024',
    highlights: [
      'Led ICT initiatives and digital transformation projects',
      'Organized tech workshops and coding bootcamps',
      'Bridged the gap between students and the technology industry',
      'Mentored fellow students in programming and tech careers',
    ],
  },
  {
    title: 'Excellence in ICT Leadership',
    org: 'Kigali Independent University',
    highlights: [
      'Recognized for outstanding contribution to ICT development',
      'Leadership in student technology initiatives',
    ],
  },
];
