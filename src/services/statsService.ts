import type { AdminStats } from '../types';
import { apiClient } from './apiClient';

export async function getAdminStats(token: string): Promise<AdminStats> {
  return apiClient<AdminStats>('/api/admin/stats', { token });
}
