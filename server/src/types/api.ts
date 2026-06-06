export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imagePath: string;
  tags: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  avatarPath: string | null;
  visible: boolean;
  createdAt: string;
}

export interface AdminStats {
  projectCount: number;
  unreadContacts: number;
  activeTestimonials: number;
  totalContacts: number;
}
