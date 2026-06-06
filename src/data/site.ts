export const site = {
  name: 'Theo Lugagne',
  tagline: 'Full Stack Developer',
  title: 'Theo Lugagne — Portfolio',
  description:
    'Portfolio of Theo Lugagne, Full Stack Developer. Projects, contact, and more.',
  navLinks: [
    { label: 'About', href: '/#about', sectionId: 'about' },
    { label: 'Projects', href: '/#projects', sectionId: 'projects' },
    { label: 'Testimonials', href: '/#testimonials', sectionId: 'testimonials' },
    { label: 'Contact', href: '/contact' },
  ],
  about: {
    title: 'About',
    description:
      'Full Stack Developer passionate about building clean, performant web applications. I enjoy working across the stack — from designing intuitive interfaces to crafting robust APIs and databases.',
  },
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
