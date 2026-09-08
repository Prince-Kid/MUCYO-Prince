export const contact = {
  email: 'mucyoprinc12@gmail.com',
  github: 'https://github.com/Prince-Kid',
  githubLabel: 'github.com/Prince-Kid',
  linkedin: 'https://www.linkedin.com/in/mucyoprince',
  linkedinLabel: 'linkedin.com/in/mucyoprince',
  whatsapp: 'https://wa.me/250783154587',
  whatsappLabel: '+250 783 154 587',
  location: 'Kigali, Rwanda',
  resumeUrl: '/MUCYO-Prince-CV.pdf',
  resumeMailto: {
    subject: 'Resume Request — MUCYO Prince',
    body: 'Hi MUCYO,\n\nI would like to request your latest resume.\n\nBest regards,',
  },
} as const;

export function mailtoHref(subject: string, body: string): string {
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
