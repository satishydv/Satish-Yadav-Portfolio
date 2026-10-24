import experience from '@/components/Experience/ExperienceData';
import { projects } from '@/components/project/projects';

export type PublishStatus = 'published' | 'draft';

export type ManagedProject = (typeof projects)[number] & {
  id: string;
  status: PublishStatus;
  featured: boolean;
};

export type ManagedExperience = (typeof experience)[number] & {
  id: string;
  status: PublishStatus;
};

export type PortfolioProfile = {
  name: string;
  role: string;
  handle: string;
  intro: string;
  location: string;
  availability: string;
};

export type LinkToggles = {
  navbarResume: boolean;
  navbarGithub: boolean;
  navbarLinkedin: boolean;
  experienceCompanyLinks: boolean;
  disabledExperienceLinks?: Record<string, boolean>;
};

export type PortfolioContent = {
  projects: ManagedProject[];
  experiences: ManagedExperience[];
  profile: PortfolioProfile;
  toggles: LinkToggles;
  updatedAt?: number;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const defaultLinkToggles: LinkToggles = {
  navbarResume: true,
  navbarGithub: true,
  navbarLinkedin: true,
  experienceCompanyLinks: true,
  disabledExperienceLinks: {},
};

export const defaultPortfolioContent: PortfolioContent = {
  projects: projects.map((project, index) => ({
    ...project,
    id: `project-${slugify(project.title) || index}`,
    status: 'published',
    featured: index < 3,
  })),
  experiences: experience.map((item, index) => ({
    ...item,
    id: `experience-${slugify(item.org) || index}`,
    status: 'published',
  })),
  profile: {
    name: 'Satish Yadav',
    role: 'Software Developer',
    handle: 'satishyadav',
    intro:
      'I craft thoughtful digital products using TypeScript, Node.js, and a healthy curiosity for how things work.',
    location: 'India',
    availability: 'Open to opportunities',
  },
  toggles: defaultLinkToggles,
  updatedAt: 0,
};

export const PORTFOLIO_STORAGE_KEY = 'satish-portfolio-content-v1';

export function normalizePortfolioContent(value: Partial<PortfolioContent>): PortfolioContent {
  return {
    projects: Array.isArray(value.projects) ? value.projects : defaultPortfolioContent.projects,
    experiences: Array.isArray(value.experiences)
      ? value.experiences
      : defaultPortfolioContent.experiences,
    profile: {
      ...defaultPortfolioContent.profile,
      ...(value.profile ?? {}),
    },
    toggles: {
      ...defaultLinkToggles,
      ...(value.toggles ?? {}),
      disabledExperienceLinks: {
        ...(defaultLinkToggles.disabledExperienceLinks ?? {}),
        ...(value.toggles?.disabledExperienceLinks ?? {}),
      },
    },
    updatedAt: typeof value.updatedAt === 'number' ? value.updatedAt : Date.now(),
  };
}
