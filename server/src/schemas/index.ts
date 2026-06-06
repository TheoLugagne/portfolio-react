import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const googleAuthSchema = z.object({
  credential: z.string().min(1, 'Google credential is required'),
});

const optionalUrl = z
  .union([z.string().url(), z.literal(''), z.null()])
  .optional()
  .transform((value) => (value === '' ? null : value ?? null));

export const projectCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string().default(''),
  content: z.string().default(''),
  imagePath: z.string().default(''),
  tags: z.array(z.string()).default([]),
  demoUrl: optionalUrl,
  githubUrl: optionalUrl,
  published: z.boolean().default(false),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const testimonialUpdateSchema = z.object({
  author: z.string().min(1).optional(),
  role: z.string().optional(),
  content: z.string().min(1).optional(),
  avatarPath: z.string().nullable().optional(),
  visible: z.boolean().optional(),
});

export const testimonialCreateSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  role: z.string().default(''),
  content: z.string().min(1, 'Content is required'),
  avatarPath: z.string().nullable().optional(),
  visible: z.boolean().default(false),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type GoogleAuthInput = z.infer<typeof googleAuthSchema>;
export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type TestimonialCreateInput = z.infer<typeof testimonialCreateSchema>;
export type TestimonialUpdateInput = z.infer<typeof testimonialUpdateSchema>;
