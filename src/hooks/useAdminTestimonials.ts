import { useCallback, useEffect, useState } from 'react';
import type { Testimonial } from '../types';
import {
  createTestimonial,
  deleteTestimonial,
  getAdminTestimonials,
  updateTestimonial,
} from '../services/testimonialService';
import type { TestimonialFormData } from '../schemas/testimonialSchema';
import { useAuth } from './useAuth';

interface UseAdminTestimonialsResult {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  create: (data: TestimonialFormData) => Promise<Testimonial>;
  update: (
    id: string,
    data: Partial<TestimonialFormData>
  ) => Promise<Testimonial>;
  remove: (id: string) => Promise<void>;
}

export function useAdminTestimonials(): UseAdminTestimonialsResult {
  const {
    state: { token },
  } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getAdminTestimonials(token);
      setTestimonials(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load testimonials'
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const create = useCallback(
    async (data: TestimonialFormData) => {
      if (!token) throw new Error('Not authenticated');
      const testimonial = await createTestimonial(data, token);
      setTestimonials((prev) => [testimonial, ...prev]);
      return testimonial;
    },
    [token]
  );

  const update = useCallback(
    async (id: string, data: Partial<TestimonialFormData>) => {
      if (!token) throw new Error('Not authenticated');
      const testimonial = await updateTestimonial(id, data, token);
      setTestimonials((prev) =>
        prev.map((item) => (item.id === id ? testimonial : item))
      );
      return testimonial;
    },
    [token]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      await deleteTestimonial(id, token);
      setTestimonials((prev) => prev.filter((item) => item.id !== id));
    },
    [token]
  );

  return { testimonials, loading, error, refetch, create, update, remove };
}
