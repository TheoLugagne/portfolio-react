import { useState } from 'react';
import type { Testimonial } from '../../types';
import type { TestimonialFormData } from '../../schemas/testimonialSchema';
import { useAdminTestimonials } from '../../hooks/useAdminTestimonials';
import { useToast } from '../../hooks/useToast';
import TestimonialForm from '../../components/admin/TestimonialForm';
import ConfirmModal from '../../components/ui/ConfirmModal';
import AdminTableSkeleton from '../../components/ui/AdminTableSkeleton';
import Button from '../../components/ui/Button';
import { resolveImageUrl } from '../../utils/imageUrl';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminTestimonialsPage() {
  const { testimonials, loading, error, create, update, remove } =
    useAdminTestimonials();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingTestimonial(null);
    setFormOpen(true);
  };

  const openEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingTestimonial(null);
  };

  const handleSubmit = async (data: TestimonialFormData) => {
    try {
      if (editingTestimonial) {
        await update(editingTestimonial.id, data);
        showToast('Testimonial updated successfully', 'success');
      } else {
        await create(data);
        showToast('Testimonial created successfully', 'success');
      }
      closeForm();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to save testimonial',
        'error'
      );
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await remove(deleteTarget.id);
      showToast('Testimonial deleted', 'success');
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete testimonial',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleVisible = async (testimonial: Testimonial) => {
    setTogglingId(testimonial.id);
    try {
      await update(testimonial.id, { visible: !testimonial.visible });
      showToast(
        testimonial.visible
          ? 'Testimonial hidden from homepage'
          : 'Testimonial published on homepage',
        'success'
      );
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to update visibility',
        'error'
      );
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-dark">Testimonials</h2>
          <p className="mt-1 font-sans text-sm text-muted">
            Manage client testimonials and their visibility on the homepage.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={openCreate}
          className="px-4 py-2 text-sm"
        >
          New testimonial
        </Button>
      </div>

      {loading && <AdminTableSkeleton columns={5} rows={4} />}

      {error && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && testimonials.length === 0 && (
        <div className="rounded-card border border-dashed border-dark/20 bg-white p-12 text-center">
          <p className="font-sans text-muted">No testimonials yet.</p>
          <Button
            type="button"
            variant="primary"
            onClick={openCreate}
            className="mt-4 px-4 py-2 text-sm"
          >
            Add your first testimonial
          </Button>
        </div>
      )}

      {!loading && !error && testimonials.length > 0 && (
        <div className="overflow-hidden rounded-card bg-white shadow-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark/10 bg-surface">
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Author
                </th>
                <th className="hidden px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted md:table-cell">
                  Content
                </th>
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Status
                </th>
                <th className="hidden px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted sm:table-cell">
                  Date
                </th>
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {testimonials.map((testimonial) => (
                <tr
                  key={testimonial.id}
                  className="border-b border-dark/5 last:border-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {testimonial.avatarPath ? (
                        <img
                          src={resolveImageUrl(testimonial.avatarPath)}
                          alt=""
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-sans text-xs font-bold text-dark"
                        >
                          {testimonial.author.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-sans text-sm font-semibold text-dark">
                          {testimonial.author}
                        </p>
                        <p className="font-sans text-xs text-muted">
                          {testimonial.role || '—'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden max-w-xs px-6 py-4 md:table-cell">
                    <p className="line-clamp-2 font-sans text-sm text-muted">
                      {testimonial.content}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => handleToggleVisible(testimonial)}
                      disabled={togglingId === testimonial.id}
                      className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold transition-colors disabled:opacity-50 ${
                        testimonial.visible
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-dark/10 text-muted hover:bg-dark/15'
                      }`}
                    >
                      {togglingId === testimonial.id
                        ? 'Updating…'
                        : testimonial.visible
                          ? 'Visible'
                          : 'Hidden'}
                    </button>
                  </td>
                  <td className="hidden px-6 py-4 font-sans text-sm text-muted sm:table-cell">
                    {formatDate(testimonial.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(testimonial)}
                        className="rounded-lg px-3 py-1.5 font-sans text-xs font-semibold text-dark transition-colors hover:bg-primary/20"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(testimonial)}
                        className="rounded-lg px-3 py-1.5 font-sans text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto p-4 pt-16"
          role="presentation"
        >
          <div
            className="absolute inset-0 animate-fade-in bg-dark/40"
            aria-hidden="true"
            onClick={closeForm}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="testimonial-form-title"
            className="relative w-full max-w-lg animate-scale-in rounded-card bg-white p-6 shadow-card"
          >
            <h3
              id="testimonial-form-title"
              className="mb-4 font-serif text-xl text-dark"
            >
              {editingTestimonial ? 'Edit testimonial' : 'New testimonial'}
            </h3>
            <TestimonialForm
              key={editingTestimonial?.id ?? 'new'}
              testimonial={editingTestimonial}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete testimonial"
        message={`Are you sure you want to delete the testimonial from "${deleteTarget?.author}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
