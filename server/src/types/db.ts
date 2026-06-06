export interface UserRow {
  id: string;
  google_id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_path: string;
  tags: string[];
  demo_url: string | null;
  github_url: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ContactRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: Date;
}

export interface TestimonialRow {
  id: string;
  author: string;
  role: string;
  content: string;
  avatar_path: string | null;
  visible: boolean;
  created_at: Date;
}

export interface StatsRow {
  project_count: number;
  unread_contacts: number;
  active_testimonials: number;
  total_contacts: number;
}
