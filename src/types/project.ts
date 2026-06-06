export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imagePath: string;
  tags: string[];
  demoUrl: string | null;
  githubUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}
