import { useCallback, useEffect, useState } from 'react';
import type { Contact } from '../types';
import { getContacts, markContactRead } from '../services/contactService';
import { useAuth } from './useAuth';

interface UseContactsResult {
  contacts: Contact[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  markAsRead: (id: string) => Promise<Contact>;
}

export function useContacts(): UseContactsResult {
  const {
    state: { token },
  } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getContacts(token);
      setContacts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load contacts');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const markAsRead = useCallback(
    async (id: string) => {
      if (!token) throw new Error('Not authenticated');
      const updated = await markContactRead(id, token);
      setContacts((prev) =>
        prev.map((item) => (item.id === id ? updated : item))
      );
      return updated;
    },
    [token]
  );

  const unreadCount = contacts.filter((c) => !c.read).length;

  return { contacts, unreadCount, loading, error, refetch, markAsRead };
}
