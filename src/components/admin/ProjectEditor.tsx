import type { ReactNode } from 'react';
import type { Project } from '../../types';
import type { ProjectFormInput } from '../../schemas/projectSchema';
import ProjectCard from '../Projects/ProjectCard';

function formToPreviewProject(
  form: ProjectFormInput,
  projectId?: string
): Project {
  return {
    id: projectId ?? 'preview',
    title: form.title || 'Project title',
    slug: form.slug || 'project-slug',
    description:
      form.description || 'Project description will appear here.',
    content: form.content,
    imagePath: form.imagePath,
    tags: form.tags,
    demoUrl: form.demoUrl || null,
    githubUrl: form.githubUrl || null,
    published: form.published,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

interface ProjectEditorProps {
  form: ProjectFormInput;
  projectId?: string;
  children: ReactNode;
}

export default function ProjectEditor({
  form,
  projectId,
  children,
}: ProjectEditorProps) {
  const previewProject = formToPreviewProject(form, projectId);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="min-w-0">{children}</div>
      <div className="min-w-0">
        <p className="mb-3 font-sans text-sm font-semibold text-muted">
          Live preview
        </p>
        <div className="overflow-hidden rounded-card border border-dark/10 bg-surface p-4">
          <ProjectCard
            project={previewProject}
            preview
            maxWidth={480}
            maxHeight={400}
          />
        </div>
      </div>
    </div>
  );
}
