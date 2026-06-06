import type { Contact } from '../types';
import type { ContactFormData } from '../schemas/contactSchema';
import { apiClient } from './apiClient';

export async function submitContact(data: ContactFormData): Promise<Contact> {
  return apiClient<Contact>('/api/contacts', {
    method: 'POST',
    body: data,
  });
}

export async function getContacts(token: string): Promise<Contact[]> {
  return apiClient<Contact[]>('/api/contacts', { token });
}

export async function markContactRead(
  id: string,
  token: string
): Promise<Contact> {
  return apiClient<Contact>(`/api/contacts/${id}/read`, {
    method: 'PATCH',
    token,
  });
}
