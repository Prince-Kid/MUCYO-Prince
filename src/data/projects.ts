export interface Project {
  name: string;
  role: string;
  problem: string;
  architecture: string;
  stack: string[];
  status: 'live' | 'internal';
  url?: string;
}

export const projects: Project[] = [
  {
    name: 'HireMe Afrika — Recruitment Platform',
    role: 'Full-stack developer',
    problem:
      'African staffing and recruiting needed a scalable platform connecting talent with employers.',
    architecture:
      'Next.js frontend with Java Spring Boot services, microservices architecture, REST APIs, and Dockerized deployments.',
    stack: ['Next.js', 'Java Spring Boot', 'REST APIs', 'Microservices', 'Docker'],
    status: 'live',
    url: 'https://hiremeafrika.com/',
  },
  {
    name: 'Nextline Homes — Real Estate Platform',
    role: 'Founding software developer',
    problem:
      'Rwanda’s property market needed verified listings, transparent pricing, and tools for buy, rent, and sell workflows.',
    architecture:
      'Next.js frontend with NestJS backend APIs for listings, users, search/filter, and property management.',
    stack: ['Next.js', 'NestJS', 'REST APIs'],
    status: 'live',
    url: 'https://www.nextlinehomes.com/',
  },
  {
    name: 'Crafter Shop — Multi-vendor E-commerce',
    role: 'Full-stack developer',
    problem:
      'Needed a production e-commerce platform with vendor management, payments, and customer support.',
    architecture:
      'React SPA with Node.js API, PostgreSQL persistence, Stripe payments, and an AI-assisted chatbot for support.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    status: 'live',
    url: 'https://crafter-shop.netlify.app/',
  },
  {
    name: 'UTS Ltd — Branded Clothing Store',
    role: 'Frontend / product engineer',
    problem:
      'Corporate clothing brand needed a modern storefront with a seamless shopping and inquiry flow.',
    architecture:
      'Next.js storefront styled with Tailwind; EmailJS for order and contact workflows.',
    stack: ['Next.js', 'Tailwind CSS', 'EmailJS'],
    status: 'live',
    url: 'https://utsshop.netlify.app/',
  },
  {
    name: 'Black Charcoal Diamond — Online Ordering',
    role: 'Frontend / product engineer',
    problem:
      'Industrial charcoal supplier needed streamlined B2B ordering and customer experience.',
    architecture:
      'Next.js ordering UI with Tailwind and EmailJS-backed order management.',
    stack: ['Next.js', 'Tailwind CSS', 'EmailJS'],
    status: 'live',
    url: 'https://blackcharcoaldiamond.netlify.app/',
  },
  {
    name: 'Charly Fashion — Wedding & Event Services',
    role: 'Frontend / product engineer',
    problem:
      'Wedding and event business needed booking for clothing, decorations, and rentals.',
    architecture:
      'Next.js booking and catalog experience with Tailwind and EmailJS integrations.',
    stack: ['Next.js', 'Tailwind CSS', 'EmailJS'],
    status: 'live',
    url: 'https://charly-fashion.vercel.app/',
  },
  {
    name: 'Agro Processing Management System',
    role: 'Full-stack developer',
    problem:
      'Agricultural processing operations needed inventory tracking and supply-chain visibility.',
    architecture:
      'PHP application with MySQL storage and Bootstrap UI for operations staff.',
    stack: ['PHP', 'MySQL', 'Bootstrap'],
    status: 'internal',
  },
  {
    name: 'Rugali Meat Processing System',
    role: 'Full-stack developer',
    problem:
      'Meat processing facility required quality control, batch tracking, and traceability.',
    architecture:
      'React client with Express API and PostgreSQL for batch and QA records.',
    stack: ['React', 'Express', 'PostgreSQL'],
    status: 'internal',
  },
  {
    name: 'NYANZA Milk Industry Management',
    role: 'Full-stack developer',
    problem:
      'Dairy operations needed production tracking, distribution analytics, and reporting.',
    architecture:
      'PHP/MySQL backend with Chart.js dashboards for production and sales reporting.',
    stack: ['PHP', 'MySQL', 'Chart.js'],
    status: 'internal',
  },
];
