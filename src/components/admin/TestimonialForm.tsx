import { type FormEvent, useState } from 'react';
import type { Testimonial } from '../../types';
import {
  testimonialFormSchema,
  type TestimonialFormData,
  type TestimonialFormInput,
  emptyTestimonialForm,
} from '../../schemas/testimonialSchema';
import { ApiClientError } from '../../services/apiClient';
import ImageUpload from './ImageUpload';
import Button from '../ui/Button';

type FieldErrors = Partial<Record<keyof TestimonialFormInput, string>>;

interface TestimonialFormProps {
  testimonial?: Testimonial | null;
  onSubmit: (data: TestimonialFormData) => Promise<void>;
  onCancel: () => void;
}

function testimonialToForm(testimonial: Testimonial): TestimonialFormInput {
  return {
    author: testimonial.author,
    role: testimonial.role,
    content: testimonial.content,
    avatarPath: testimonial.avatarPath,
    visible: testimonial.visible,
  };
}

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[]
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && !errors[field as keyof TestimonialFormInput]) {
      errors[field as keyof TestimonialFormInput] = issue.message;
    }
  }
  return errors;
}

export default function TestimonialForm({
  testimonial,
  onSubmit,
  onCancel,
}: TestimonialFormProps) {
  const [form, setForm] = useState<TestimonialFormInput>(
    testimonial ? testimonialToForm(testimonial) : emptyTestimonialForm
  );
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = <K extends keyof TestimonialFormInput>(
    field: K,
    value: TestimonialFormInput[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = testimonialFormSchema.safeParse(form);
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
            apiErrors[key as keyof TestimonialFormInput] = messages[0];
          }
        }
        setFieldErrors(apiErrors);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName = (field: keyof TestimonialFormInput) =>
    `w-full rounded-lg border bg-white px-4 py-2 font-sans text-sm text-dark placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      fieldErrors[field] ? 'border-red-500' : 'border-dark/20'
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="testimonial-author"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            Author
          </label>
          <input
            id="testimonial-author"
            type="text"
            value={form.author}
            onChange={(e) => updateField('author', e.target.value)}
            className={inputClassName('author')}
          />
          {fieldErrors.author && (
            <p className="mt-1 font-sans text-sm text-red-600" role="alert">
              {fieldErrors.author}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="testimonial-role"
            className="mb-1 block font-sans text-sm font-semibold text-dark"
          >
            Role
          </label>
          <input
            id="testimonial-role"
            type="text"
            value={form.role}
            onChange={(e) => updateField('role', e.target.value)}
            className={inputClassName('role')}
            placeholder="e.g. Product Manager"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="testimonial-content"
          className="mb-1 block font-sans text-sm font-semibold text-dark"
        >
          Content
        </label>
        <textarea
          id="testimonial-content"
          rows={4}
          value={form.content}
          onChange={(e) => updateField('content', e.target.value)}
          className={`${inputClassName('content')} resize-y`}
        />
        {fieldErrors.content && (
          <p className="mt-1 font-sans text-sm text-red-600" role="alert">
            {fieldErrors.content}
          </p>
        )}
      </div>

      <ImageUpload
        value={form.avatarPath ?? ''}
        onChange={(path) => updateField('avatarPath', path || null)}
        onError={(message) =>
          setFieldErrors((prev) => ({ ...prev, avatarPath: message }))
        }
        subdir="testimonials"
        label="Avatar"
        previewAlt="Avatar preview"
      />
      {fieldErrors.avatarPath && (
        <p className="font-sans text-sm text-red-600" role="alert">
          {fieldErrors.avatarPath}
        </p>
      )}

      <label className="flex cursor-pointer items-center gap-3">
        <input
          type="checkbox"
          checked={form.visible}
          onChange={(e) => updateField('visible', e.target.checked)}
          className="h-4 w-4 rounded border-dark/20 text-primary focus:ring-primary"
        />
        <span className="font-sans text-sm font-semibold text-dark">
          Visible on homepage
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
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="px-4 py-2 text-sm"
        >
          {submitting
            ? 'Saving…'
            : testimonial
              ? 'Update testimonial'
              : 'Create testimonial'}
        </Button>
      </div>
    </form>
  );
}
