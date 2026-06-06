import { type FormEvent, useRef, useState } from 'react';
import type { Project } from '../../types';
import {
  projectFormSchema,
  type ProjectFormData,
  type ProjectFormInput,
  emptyProjectForm,
} from '../../schemas/projectSchema';
import { ApiClientError } from '../../services/apiClient';
import ImageUpload from './ImageUpload';
import ProjectEditor from './ProjectEditor';
import Button from '../ui/Button';

type FieldErrors = Partial<Record<keyof ProjectFormInput, string>>;

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => Promise<void>;
  onCancel: () => void;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function projectToForm(project: Project): ProjectFormInput {
  return {
    title: project.title,
    slug: project.slug,
    description: project.description,
    content: project.content,
    imagePath: project.imagePath,
    tags: project.tags,
    demoUrl: project.demoUrl ?? '',
    githubUrl: project.githubUrl ?? '',
    published: project.published,
  };
}

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[]
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !errors[field as keyof ProjectFormInput]) {
      errors[field as keyof ProjectFormInput] = issue.message;
    }
  }
  return errors;
}

export default function ProjectForm({
  project,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  const [form, setForm] = useState<ProjectFormInput>(
    project ? projectToForm(project) : emptyProjectForm
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const slugManuallyEdited = useRef(Boolean(project));

  const updateField = <K extends keyof ProjectFormInput>(
    field: K,
    value: ProjectFormInput[K]
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'title' && !slugManuallyEdited.current) {
        next.slug = slugify(String(value));
      }
      return next;
    });
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || form.tags.includes(tag)) {
      setTagInput('');
      return;
    }
    updateField('tags', [...form.tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    updateField(
      'tags',
      form.tags.filter((t) => t !== tag)
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = projectFormSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(fieldErrorsFromZod(result.error.issues));
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      await onSubmit(result.data);
    } catch (err) {
      if (err instanceof ApiClientError && err.fieldErrors) {
        const apiErrors: FieldErrors = {};
        for (const [key, messages] of Object.entries(err.fieldErrors)) {
          if (messages[0]) {
            apiErrors[key as keyof ProjectFormInput] = messages[0];
          }
        }
        setFieldErrors(apiErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName = (field: keyof ProjectFormInput) =>
    `w-full rounded-lg border bg-white px-4 py-2 font-sans text-sm text-dark placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      fieldErrors[field] ? 'border-red-500' : 'border-dark/20'
    }`;

  return (
    <ProjectEditor form={form} projectId={project?.id}>
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="project-title"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            Title
          </label>
          <input
            id="project-title"
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            className={inputClassName('title')}
          />
          {fieldErrors.title && (
            <p className="mt-1 font-sans text-sm text-red-600" role="alert">
              {fieldErrors.title}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="project-slug"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            Slug
          </label>
          <input
            id="project-slug"
            type="text"
            value={form.slug}
            onChange={(e) => {
              slugManuallyEdited.current = true;
              updateField('slug', e.target.value);
            }}
            className={inputClassName('slug')}
          />
          {fieldErrors.slug && (
            <p className="mt-1 font-sans text-sm text-red-600" role="alert">
              {fieldErrors.slug}
            </p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="project-description"
          className="mb-1 block font-sans text-sm font-semibold text-dark"
        >
          Description
        </label>
        <textarea
          id="project-description"
          rows={2}
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          className={`${inputClassName('description')} resize-y`}
        />
      </div>

      <div>
        <label
          htmlFor="project-content"
          className="mb-1 block font-sans text-sm font-semibold text-dark"
        >
          Content
        </label>
        <textarea
          id="project-content"
          rows={5}
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          className={`${inputClassName('content')} resize-y`}
        />
      </div>

      <div>
        <span className="mb-1 block font-sans text-sm font-semibold text-dark">
          Tags
        </span>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder="Add a tag and press Enter"
            className={inputClassName('tags')}
          />
          <Button type="button" variant="outline" onClick={addTag} className="px-4 py-2 text-sm">
            Add
          </Button>
        </div>
        {form.tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-2">
            {form.tags.map((tag) => (
              <li key={tag}>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-3 py-1 font-sans text-xs font-semibold text-dark hover:bg-primary/30"
                >
                  {tag}
                  <span aria-hidden="true">×</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="project-demo-url"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            Demo URL
          </label>
          <input
            id="project-demo-url"
            type="url"
          value={form.demoUrl}
          onChange={(e) => updateField('demoUrl', e.target.value)}
            className={inputClassName('demoUrl')}
            placeholder="https://"
          />
          {fieldErrors.demoUrl && (
            <p className="mt-1 font-sans text-sm text-red-600" role="alert">
              {fieldErrors.demoUrl}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="project-github-url"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            GitHub URL
          </label>
          <input
            id="project-github-url"
            type="url"
          value={form.githubUrl}
          onChange={(e) => updateField('githubUrl', e.target.value)}
            className={inputClassName('githubUrl')}
            placeholder="https://"
          />
          {fieldErrors.githubUrl && (
            <p className="mt-1 font-sans text-sm text-red-600" role="alert">
              {fieldErrors.githubUrl}
            </p>
          )}
        </div>
      </div>

      <ImageUpload
        value={form.imagePath}
        onChange={(path) => updateField('imagePath', path)}
        onError={(message) =>
          setFieldErrors((prev) => ({ ...prev, imagePath: message }))
        }
        subdir="projects"
        label="Image"
        previewAlt="Project preview"
      />
      {fieldErrors.imagePath && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {fieldErrors.imagePath}
        </p>
      )}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => updateField('published', e.target.checked)}
          className="h-4 w-4 rounded border-dark/20 text-primary focus:ring-primary"
        />
        <span className="font-sans text-sm font-semibold text-dark">
          Published
        </span>
      </label>

      <div className="flex justify-end gap-3 border-t border-dark/10 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-lg px-4 py-2 font-sans text-sm font-semibold text-muted transition-colors hover:bg-dark/5 hover:text-dark disabled:opacity-50"
        >
          Cancel
        </button>
        <Button type="submit" variant="primary" disabled={submitting} className="px-4 py-2 text-sm">
          {submitting ? 'Saving…' : project ? 'Update project' : 'Create project'}
        </Button>
      </div>
    </form>
    </ProjectEditor>
  );
}
