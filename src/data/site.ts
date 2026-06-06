export const site = {
  name: 'Theo Lugagne',
  tagline: 'Full Stack Developer',
  title: 'Theo Lugagne — Portfolio',
  description:
    'Portfolio of Theo Lugagne, Full Stack Developer. Projects, contact, and more.',
  navLinks: [
    { label: 'Projects', href: '/#projects' },
    { label: 'Contacts', href: '/contact' },
  ],
  hero: {
    role: 'Full Stack Developer',
    title: 'Hello, my name is',
    name: 'Theo Lugagne',
    description:
      'Short text with details about you, what you do or your professional career. You can add more information on the about page.',
    primaryCta: { label: 'Projects', href: '/#projects' },
    secondaryCta: {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/tlugagne/',
    },
  },
} as const;
