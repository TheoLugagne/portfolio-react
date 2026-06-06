import { z } from 'zod';

function optionalUrlField() {
  return z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine(
      (value) =>
        value === null ||
        (typeof value === 'string' && /^https?:\/\/.+/i.test(value)),
      { message: 'Must be a valid URL' }
    );
}

export const projectFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  description: z.string(),
  content: z.string(),
  imagePath: z.string(),
  tags: z.array(z.string()),
  demoUrl: optionalUrlField(),
  githubUrl: optionalUrlField(),
  published: z.boolean(),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;

export interface ProjectFormInput {
  title: string;
  slug: string;
  description: string;
  content: string;
  imagePath: string;
  tags: string[];
  demoUrl: string;
  githubUrl: string;
  published: boolean;
}

export const emptyProjectForm: ProjectFormInput = {
  title: '',
  slug: '',
  description: '',
  content: '',
  imagePath: '',
  tags: [],
  demoUrl: '',
  githubUrl: '',
  published: false,
};
