import { type FormEvent, useState } from 'react';
import { contactSchema, type ContactFormData } from '../../schemas/contactSchema';
import { submitContact } from '../../services/contactService';
import { ApiClientError } from '../../services/apiClient';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';

type FieldErrors = Partial<Record<keyof ContactFormData, string>>;

const emptyForm: ContactFormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

function fieldErrorsFromZod(
  issues: { path: PropertyKey[]; message: string }[]
): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && field in emptyForm && !errors[field as keyof ContactFormData]) {
      errors[field as keyof ContactFormData] = issue.message;
    }
  }
  return errors;
}

export default function ContactForm() {
  const { showToast } = useToast();
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const updateField = (field: keyof ContactFormData, value: string) => {
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

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      setFieldErrors(fieldErrorsFromZod(result.error.issues));
      return;
    }

    setFieldErrors({});
    setSubmitting(true);

    try {
      await submitContact(result.data);
      setForm(emptyForm);
      showToast('Message sent successfully. Thank you!', 'success');
    } catch (err) {
      if (err instanceof ApiClientError && err.fieldErrors) {
        const apiErrors: FieldErrors = {};
        for (const [key, messages] of Object.entries(err.fieldErrors)) {
          if (key in emptyForm && messages[0]) {
            apiErrors[key as keyof ContactFormData] = messages[0];
          }
        }
        setFieldErrors(apiErrors);
      }
      showToast(
        err instanceof Error ? err.message : 'Failed to send message',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName = (field: keyof ContactFormData) =>
    `w-full rounded-lg border bg-white px-4 py-3 font-sans text-base text-dark placeholder:text-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
      fieldErrors[field] ? 'border-red-500' : 'border-dark/20'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto max-w-lg space-y-6"
    >
      <div>
        <label htmlFor="contact-name" className="mb-2 block font-sans text-sm font-semibold text-dark">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          className={inputClassName('name')}
          autoComplete="name"
          aria-invalid={Boolean(fieldErrors.name)}
          aria-describedby={fieldErrors.name ? 'contact-name-error' : undefined}
        />
        {fieldErrors.name && (
          <p id="contact-name-error" className="mt-1 font-sans text-sm text-red-600" role="alert">
            {fieldErrors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-email" className="mb-2 block font-sans text-sm font-semibold text-dark">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={form.email}
          onChange={(e) => updateField('email', e.target.value)}
          className={inputClassName('email')}
          autoComplete="email"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? 'contact-email-error' : undefined}
        />
        {fieldErrors.email && (
          <p id="contact-email-error" className="mt-1 font-sans text-sm text-red-600" role="alert">
            {fieldErrors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-subject" className="mb-2 block font-sans text-sm font-semibold text-dark">
          Subject
        </label>
        <input
          id="contact-subject"
          type="text"
          name="subject"
          value={form.subject}
          onChange={(e) => updateField('subject', e.target.value)}
          className={inputClassName('subject')}
          aria-invalid={Boolean(fieldErrors.subject)}
          aria-describedby={fieldErrors.subject ? 'contact-subject-error' : undefined}
        />
        {fieldErrors.subject && (
          <p id="contact-subject-error" className="mt-1 font-sans text-sm text-red-600" role="alert">
            {fieldErrors.subject}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className="mb-2 block font-sans text-sm font-semibold text-dark">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => updateField('message', e.target.value)}
          className={`${inputClassName('message')} resize-y`}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? 'contact-message-error' : undefined}
        />
        {fieldErrors.message && (
          <p id="contact-message-error" className="mt-1 font-sans text-sm text-red-600" role="alert">
            {fieldErrors.message}
          </p>
        )}
      </div>

      <Button type="submit" variant="primary" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? 'Sending…' : 'Send message'}
      </Button>
    </form>
  );
}
