import { z } from 'zod';

export const testimonialFormSchema = z.object({
  author: z.string().min(1, 'Author is required'),
  role: z.string(),
  content: z.string().min(1, 'Content is required'),
  avatarPath: z.string().nullable(),
  visible: z.boolean(),
});

export type TestimonialFormData = z.infer<typeof testimonialFormSchema>;

export interface TestimonialFormInput {
  author: string;
  role: string;
  content: string;
  avatarPath: string | null;
  visible: boolean;
}

export const emptyTestimonialForm: TestimonialFormInput = {
  author: '',
  role: '',
  content: '',
  avatarPath: null,
  visible: false,
};
