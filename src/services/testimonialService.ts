import type { Testimonial } from '../types';
import type { TestimonialFormData } from '../schemas/testimonialSchema';
import { apiClient } from './apiClient';

export async function getTestimonials(): Promise<Testimonial[]> {
  return apiClient<Testimonial[]>('/api/testimonials');
}

export async function getAdminTestimonials(
  token: string
): Promise<Testimonial[]> {
  return apiClient<Testimonial[]>('/api/testimonials/admin/all', { token });
}

export async function createTestimonial(
  data: TestimonialFormData,
  token: string
): Promise<Testimonial> {
  return apiClient<Testimonial>('/api/testimonials', {
    method: 'POST',
    body: data,
    token,
  });
}

export async function updateTestimonial(
  id: string,
  data: Partial<TestimonialFormData>,
  token: string
): Promise<Testimonial> {
  return apiClient<Testimonial>(`/api/testimonials/${id}`, {
    method: 'PATCH',
    body: data,
    token,
  });
}

export async function deleteTestimonial(
  id: string,
  token: string
): Promise<void> {
  return apiClient<void>(`/api/testimonials/${id}`, {
    method: 'DELETE',
    token,
  });
}
