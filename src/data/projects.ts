export interface StaticProject {
  id: number;
  title: string;
  description: string;
  image: string;
  url: string;
  reversed: boolean;
}

export const projects: StaticProject[] = [
  {
    id: 1,
    title: 'Project Name',
    description:
      'What was your role, your deliverables, if the project was personal, freelancing.',
    image: '/assets/images/project-1.jpg',
    url: '/projects/1',
    reversed: false,
  },
  {
    id: 2,
    title: 'Project Name',
    description:
      'What was your role, your deliverables, if the project was personal, freelancing.',
    image: '/assets/images/project-2.jpg',
    url: '/projects/2',
    reversed: true,
  },
  {
    id: 3,
    title: 'Project Name',
    description:
      'What was your role, your deliverables, if the project was personal, freelancing.',
    image: '/assets/images/project-3.jpg',
    url: '/projects/3',
    reversed: false,
  },
];
