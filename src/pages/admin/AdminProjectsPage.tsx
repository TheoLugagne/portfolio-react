import { useState } from 'react';
import type { Project } from '../../types';
import type { ProjectFormData } from '../../schemas/projectSchema';
import { useAdminProjects } from '../../hooks/useAdminProjects';
import { useToast } from '../../hooks/useToast';
import ProjectForm from '../../components/admin/ProjectForm';
import ConfirmModal from '../../components/ui/ConfirmModal';
import AdminTableSkeleton from '../../components/ui/AdminTableSkeleton';
import Button from '../../components/ui/Button';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function AdminProjectsPage() {
  const { projects, loading, error, create, update, remove } =
    useAdminProjects();
  const { showToast } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingProject(null);
    setFormOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject(project);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        await update(editingProject.id, data);
        showToast('Project updated successfully', 'success');
      } else {
        await create(data);
        showToast('Project created successfully', 'success');
      }
      closeForm();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to save project',
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
      showToast('Project deleted', 'success');
      setDeleteTarget(null);
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Failed to delete project',
        'error'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-dark">Projects</h2>
          <p className="mt-1 font-sans text-sm text-muted">
            Create, edit, and publish portfolio projects.
          </p>
        </div>
        <Button type="button" variant="primary" onClick={openCreate} className="px-4 py-2 text-sm">
          New project
        </Button>
      </div>

      {loading && <AdminTableSkeleton columns={5} rows={4} />}

      {error && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="rounded-card border border-dashed border-dark/20 bg-white p-12 text-center">
          <p className="font-sans text-muted">No projects yet.</p>
          <Button
            type="button"
            variant="primary"
            onClick={openCreate}
            className="mt-4 px-4 py-2 text-sm"
          >
            Create your first project
          </Button>
        </div>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="overflow-hidden rounded-card bg-white shadow-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-dark/10 bg-surface">
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Title
                </th>
                <th className="hidden px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted sm:table-cell">
                  Slug
                </th>
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Status
                </th>
                <th className="hidden px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted md:table-cell">
                  Updated
                </th>
                <th className="px-6 py-3 font-sans text-xs font-semibold uppercase tracking-wide text-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b border-dark/5 last:border-0"
                >
                  <td className="px-6 py-4 font-sans text-sm font-semibold text-dark">
                    {project.title}
                  </td>
                  <td className="hidden px-6 py-4 font-sans text-sm text-muted sm:table-cell">
                    {project.slug}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-sans text-xs font-semibold ${
                        project.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-dark/10 text-muted'
                      }`}
                    >
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="hidden px-6 py-4 font-sans text-sm text-muted md:table-cell">
                    {formatDate(project.updatedAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(project)}
                        className="rounded-lg px-3 py-1.5 font-sans text-xs font-semibold text-dark transition-colors hover:bg-primary/20"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(project)}
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
            aria-labelledby="project-form-title"
            className="relative w-full max-w-5xl animate-scale-in rounded-card bg-white p-6 shadow-card"
          >
            <h3
              id="project-form-title"
              className="mb-4 font-serif text-xl text-dark"
            >
              {editingProject ? 'Edit project' : 'New project'}
            </h3>
            <ProjectForm
              key={editingProject?.id ?? 'new'}
              project={editingProject}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete project"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
