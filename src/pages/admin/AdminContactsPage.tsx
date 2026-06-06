import { useState } from 'react';
import type { Contact } from '../../types';
import { useContacts } from '../../hooks/useContacts';
import { useToast } from '../../hooks/useToast';
import ConfirmModal from '../../components/ui/ConfirmModal';
import AdminTableSkeleton from '../../components/ui/AdminTableSkeleton';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminContactsPage() {
  const { contacts, loading, error, markAsRead } = useContacts();
  const { showToast } = useToast();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [markReadTarget, setMarkReadTarget] = useState<Contact | null>(null);
  const [marking, setMarking] = useState(false);

  const selected = contacts.find((c) => c.id === selectedId) ?? null;

  const handleMarkRead = async () => {
    if (!markReadTarget) return;
    setMarking(true);
    try {
      await markAsRead(markReadTarget.id);
      showToast('Message marked as read', 'success');
      setMarkReadTarget(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to mark as read',
        'error'
      );
    } finally {
      setMarking(false);
    }
  };

  const toggleSelect = (contact: Contact) => {
    setSelectedId((prev) => (prev === contact.id ? null : contact.id));
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-2xl text-dark">Contacts</h2>
        <p className="mt-1 font-sans text-sm text-muted">
          View and manage contact form submissions.
        </p>
      </div>

      {loading && <AdminTableSkeleton columns={4} rows={5} />}

      {error && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && contacts.length === 0 && (
        <div className="rounded-card border border-dashed border-dark/20 bg-white p-12 text-center">
          <p className="font-sans text-muted">No contact messages yet.</p>
        </div>
      )}

      {!loading && !error && contacts.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="overflow-hidden rounded-card bg-white shadow-card lg:col-span-3">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-dark/10 bg-surface">
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                    From
                  </th>
                  <th className="hidden px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted sm:table-cell">
                    Subject
                  </th>
                  <th className="px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted md:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    onClick={() => toggleSelect(contact)}
                    className={`cursor-pointer border-b border-dark/5 transition-colors last:border-0 hover:bg-surface ${
                      selectedId === contact.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-sans text-sm font-semibold text-dark">
                        {contact.name}
                      </p>
                      <p className="font-sans text-xs text-muted">
                        {contact.email}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 font-sans text-sm text-dark sm:table-cell">
                      {contact.subject}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${
                          contact.read
                            ? 'bg-dark/10 text-muted'
                            : 'bg-primary/30 text-dark'
                        }`}
                      >
                        {contact.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 font-sans text-xs text-muted md:table-cell">
                      {formatDate(contact.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-card bg-white p-6 shadow-card lg:col-span-2">
            {selected ? (
              <>
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg text-dark">
                      {selected.subject}
                    </h3>
                    <p className="mt-1 font-sans text-sm text-muted">
                      {selected.name} ·{' '}
                      <a
                        href={`mailto:${selected.email}`}
                        className="text-dark underline hover:no-underline"
                      >
                        {selected.email}
                      </a>
                    </p>
                    <p className="mt-1 font-sans text-xs text-muted">
                      {formatDate(selected.createdAt)}
                    </p>
                  </div>
                  {!selected.read && (
                    <button
                      type="button"
                      onClick={() => setMarkReadTarget(selected)}
                      className="flex-shrink-0 rounded-lg bg-primary/20 px-3 py-1.5 font-sans text-xs font-semibold text-dark transition-colors hover:bg-primary/30"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
                <p className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-dark">
                  {selected.message}
                </p>
              </>
            ) : (
              <p className="font-sans text-sm text-muted">
                Select a message to view its contents.
              </p>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        open={markReadTarget !== null}
        title="Mark as read"
        message={`Mark the message from "${markReadTarget?.name}" as read?`}
        confirmLabel="Mark as read"
        loading={marking}
        onConfirm={handleMarkRead}
        onCancel={() => setMarkReadTarget(null)}
      />
    </div>
  );
}
