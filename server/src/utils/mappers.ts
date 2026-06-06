import type {
  Contact,
  Project,
  Testimonial,
  User,
} from '../types/api';
import type {
  ContactRow,
  ProjectRow,
  TestimonialRow,
  UserRow,
} from '../types/db';

export function mapUser(row: Pick<UserRow, 'id' | 'email' | 'name' | 'avatar_url'>): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    avatarUrl: row.avatar_url,
  };
}

export function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description,
    content: row.content,
    imagePath: row.image_path,
    tags: row.tags ?? [],
    demoUrl: row.demo_url,
    githubUrl: row.github_url,
    published: row.published,
    createdAt: row.created_at.toISOString(),
    updatedAt: row.updated_at.toISOString(),
  };
}

export function mapContact(row: ContactRow): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    read: row.read,
    createdAt: row.created_at.toISOString(),
  };
}

export function mapTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    author: row.author,
    role: row.role,
    content: row.content,
    avatarPath: row.avatar_path,
    visible: row.visible,
    createdAt: row.created_at.toISOString(),
  };
}
