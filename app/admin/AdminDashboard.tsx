'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  CircleUserRound,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  FolderKanban,
  Github,
  Globe2,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  PencilLine,
  Plus,
  RotateCcw,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { toast } from 'sonner';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';
import { useDarkmode } from '@/store/useDarkmode';
import { usePortfolioContent } from '@/store/usePortfolioContent';
import type {
  LinkToggles,
  ManagedExperience,
  ManagedProject,
  PortfolioProfile,
  PublishStatus,
} from '@/lib/portfolio-content';
import { logoutAdmin } from './actions';

type Section = 'overview' | 'projects' | 'experience' | 'profile' | 'toggle' | 'settings';

type NavigationItem = {
  id: Section;
  label: string;
  icon: LucideIcon;
};

const navigation: NavigationItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'experience', label: 'Experience', icon: BriefcaseBusiness },
  { id: 'profile', label: 'Profile', icon: CircleUserRound },
  { id: 'toggle', label: 'Toggle', icon: SlidersHorizontal },
];

const inputClass =
  'w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-white/25 dark:focus:ring-white/5';
const labelClass = 'mb-2 block text-xs font-semibold text-zinc-600 dark:text-zinc-300';
const cardClass =
  'rounded-[16px] border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:border-white/[0.08] dark:bg-[#1b1b18]';

const createProject = (): ManagedProject => ({
  id: `project-${Date.now()}`,
  title: '',
  desc: '',
  srcLink: '',
  webLink: '',
  skills: [],
  imgLink: '/projects/cat.webp',
  color: 'bg-amber-100 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800',
  status: 'draft',
  featured: false,
});

const createExperience = (): ManagedExperience => ({
  id: `experience-${Date.now()}`,
  org: '',
  duration: '',
  logo: '/company/favicon.ico',
  role: '',
  link: '',
  desc: [],
  status: 'draft',
});

export default function AdminDashboard() {
  const { content, setContent, resetContent, isReady } = usePortfolioContent();
  const { isDarkmode, toggleDarkmode } = useDarkmode();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projectEditor, setProjectEditor] = useState<ManagedProject | null>(null);
  const [experienceEditor, setExperienceEditor] = useState<ManagedExperience | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [profileDraft, setProfileDraft] = useState<PortfolioProfile>(content.profile);

  useEffect(() => setProfileDraft(content.profile), [content.profile]);

  const publishedProjects = content.projects.filter((item) => item.status === 'published');
  const publishedExperiences = content.experiences.filter((item) => item.status === 'published');
  const skills = useMemo(
    () =>
      new Set(content.projects.flatMap((project) => project.skills.map((skill) => skill.trim()))),
    [content.projects]
  );

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return content.projects;
    return content.projects.filter((project) =>
      [project.title, project.desc, ...project.skills].some((value) =>
        value.toLowerCase().includes(query)
      )
    );
  }, [content.projects, searchQuery]);

  const filteredExperiences = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return content.experiences;
    return content.experiences.filter((item) =>
      [item.org, item.role, item.duration].some((value) => value.toLowerCase().includes(query))
    );
  }, [content.experiences, searchQuery]);

  const goToSection = (section: Section) => {
    setActiveSection(section);
    setSearchQuery('');
    setMobileNavOpen(false);
  };

  const openNewProject = () => {
    setIsCreating(true);
    setProjectEditor(createProject());
  };

  const openNewExperience = () => {
    setIsCreating(true);
    setExperienceEditor(createExperience());
  };

  const saveProject = (event: FormEvent) => {
    event.preventDefault();
    if (!projectEditor?.title.trim()) return;

    setContent((current) => ({
      ...current,
      projects: isCreating
        ? [projectEditor, ...current.projects]
        : current.projects.map((project) =>
            project.id === projectEditor.id ? projectEditor : project
          ),
    }));
    setProjectEditor(null);
    setIsCreating(false);
    toast.success(isCreating ? 'Project added' : 'Project updated');
  };

  const saveExperience = (event: FormEvent) => {
    event.preventDefault();
    if (!experienceEditor?.org.trim() || !experienceEditor.role.trim()) return;

    setContent((current) => ({
      ...current,
      experiences: isCreating
        ? [experienceEditor, ...current.experiences]
        : current.experiences.map((item) =>
            item.id === experienceEditor.id ? experienceEditor : item
          ),
    }));
    setExperienceEditor(null);
    setIsCreating(false);
    toast.success(isCreating ? 'Experience added' : 'Experience updated');
  };

  const removeProject = (project: ManagedProject) => {
    if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) return;
    setContent((current) => ({
      ...current,
      projects: current.projects.filter((item) => item.id !== project.id),
    }));
    toast.success('Project deleted');
  };

  const removeExperience = (item: ManagedExperience) => {
    if (!window.confirm(`Delete your experience at “${item.org}”?`)) return;
    setContent((current) => ({
      ...current,
      experiences: current.experiences.filter((experience) => experience.id !== item.id),
    }));
    toast.success('Experience deleted');
  };

  const toggleProjectStatus = (project: ManagedProject) => {
    const status: PublishStatus = project.status === 'published' ? 'draft' : 'published';
    setContent((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === project.id ? { ...item, status } : item
      ),
    }));
    toast.success(status === 'published' ? 'Project published' : 'Project moved to drafts');
  };

  const toggleExperienceStatus = (experience: ManagedExperience) => {
    const status: PublishStatus = experience.status === 'published' ? 'draft' : 'published';
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((item) =>
        item.id === experience.id ? { ...item, status } : item
      ),
    }));
    toast.success(status === 'published' ? 'Experience published' : 'Experience moved to drafts');
  };

  const moveItem = (collection: 'projects' | 'experiences', index: number, direction: -1 | 1) => {
    setContent((current) => {
      const items = [...current[collection]];
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= items.length) return current;
      [items[index], items[nextIndex]] = [items[nextIndex], items[index]];
      return { ...current, [collection]: items };
    });
  };

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    setContent((current) => ({ ...current, profile: profileDraft }));
    toast.success('Profile updated');
  };

  const exportContent = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'satish-portfolio-content.json';
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Content exported');
  };

  const handleReset = () => {
    if (!window.confirm('Reset projects, experience, profile, and toggles to the original content?'))
      return;
    resetContent();
    toast.success('Portfolio restored to defaults');
  };

  const toggleNavbarLink = (key: 'navbarResume' | 'navbarGithub' | 'navbarLinkedin') => {
    const isCurrent = content.toggles?.[key] !== false;
    const nextVal = !isCurrent;
    setContent((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        [key]: nextVal,
      },
    }));
    const labels = {
      navbarResume: 'Resume link',
      navbarGithub: 'GitHub link',
      navbarLinkedin: 'LinkedIn link',
    };
    toast.success(`${labels[key]} ${nextVal ? 'enabled' : 'turned off'}`);
  };

  const toggleExperienceMaster = () => {
    const currentVal = content.toggles?.experienceCompanyLinks !== false;
    const nextVal = !currentVal;
    setContent((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        experienceCompanyLinks: nextVal,
      },
    }));
    toast.success(`Company website links ${nextVal ? 'enabled' : 'turned off'} globally`);
  };

  const toggleIndividualExperienceLink = (id: string, org: string) => {
    const isCurrentlyDisabled =
      Boolean(id && content.toggles?.disabledExperienceLinks?.[id]) ||
      Boolean(content.toggles?.disabledExperienceLinks?.[org]);
    const nextDisabled = !isCurrentlyDisabled;

    setContent((current) => ({
      ...current,
      toggles: {
        ...current.toggles,
        disabledExperienceLinks: {
          ...(current.toggles?.disabledExperienceLinks || {}),
          ...(id ? { [id]: nextDisabled } : {}),
          [org]: nextDisabled,
        },
      },
    }));
    toast.success(`${org} company link ${nextDisabled ? 'turned off' : 'enabled'}`);
  };

  const enableAllLinks = () => {
    setContent((current) => ({
      ...current,
      toggles: {
        navbarResume: true,
        navbarGithub: true,
        navbarLinkedin: true,
        experienceCompanyLinks: true,
        disabledExperienceLinks: {},
      },
    }));
    toast.success('All external links enabled');
  };

  const disableAllLinks = () => {
    const allExpDisabled: Record<string, boolean> = {};
    content.experiences.forEach((exp) => {
      if (exp.id) allExpDisabled[exp.id] = true;
      allExpDisabled[exp.org] = true;
    });
    setContent((current) => ({
      ...current,
      toggles: {
        navbarResume: false,
        navbarGithub: false,
        navbarLinkedin: false,
        experienceCompanyLinks: false,
        disabledExperienceLinks: allExpDisabled,
      },
    }));
    toast.info('All external links turned off');
  };

  const disabledLinkCount = useMemo(() => {
    let count = 0;
    if (content.toggles?.navbarResume === false) count += 1;
    if (content.toggles?.navbarGithub === false) count += 1;
    if (content.toggles?.navbarLinkedin === false) count += 1;
    if (content.toggles?.experienceCompanyLinks === false) {
      count += content.experiences.length;
    } else {
      content.experiences.forEach((exp) => {
        if (
          (exp.id && content.toggles?.disabledExperienceLinks?.[exp.id]) ||
          content.toggles?.disabledExperienceLinks?.[exp.org]
        ) {
          count += 1;
        }
      });
    }
    return count;
  }, [content.toggles, content.experiences]);

  return (
    <div
      className={cn(
        'min-h-screen bg-[#f3f2ee] text-zinc-950 dark:bg-[#10100e] dark:text-zinc-50',
        Bricolage
      )}
    >
      {mobileNavOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[220px] flex-col border-r border-black/[0.06] bg-[#f8f7f3] p-3 transition-transform duration-300 dark:border-white/[0.07] dark:bg-[#171714]',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between px-2 pt-1 pb-7">
          <button
            type="button"
            onClick={() => goToSection('overview')}
            className="flex items-center gap-3"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-300 text-xs font-black text-zinc-950 shadow-[0_6px_18px_rgba(245,185,40,.25)]">
              SY
            </span>
            <span className="text-sm font-bold tracking-[-0.02em]">Portfolio OS</span>
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 text-zinc-400 lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-black/[0.06] bg-white p-3 dark:border-white/[0.08] dark:bg-white/[0.04]">
          <div className="flex size-9 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            SY
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold">{content.profile.name}</p>
            <p className="truncate text-[10px] text-zinc-400">Portfolio owner</p>
          </div>
          <MoreHorizontal className="size-4 text-zinc-400" />
        </div>

        <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.16em] text-zinc-400 uppercase">
          Workspace
        </p>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goToSection(item.id)}
              className={cn(
                'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition',
                activeSection === item.id
                  ? 'bg-zinc-950 text-white shadow-sm dark:bg-white dark:text-zinc-950'
                  : 'text-zinc-500 hover:bg-black/[0.04] hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.05] dark:hover:text-white'
              )}
            >
              <item.icon className="size-[15px]" />
              {item.label}
              {item.id === 'projects' && (
                <span className="ml-auto rounded-md bg-amber-300/80 px-1.5 py-0.5 text-[9px] font-bold text-zinc-900">
                  {content.projects.length}
                </span>
              )}
              {item.id === 'toggle' && (
                <span
                  className={cn(
                    'ml-auto rounded-md px-1.5 py-0.5 text-[9px] font-bold transition-colors',
                    disabledLinkCount > 0
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  )}
                >
                  {disabledLinkCount > 0 ? `${disabledLinkCount} off` : 'All on'}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1 border-t border-black/[0.06] pt-4 dark:border-white/[0.07]">
          <button
            type="button"
            onClick={() => goToSection('settings')}
            className={cn(
              'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-semibold transition',
              activeSection === 'settings'
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-500 hover:bg-black/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.05]'
            )}
          >
            <Settings className="size-[15px]" /> Settings
          </button>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-zinc-500 transition hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-500/10 dark:hover:text-red-300"
            >
              <LogOut className="size-[15px]" /> Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[220px]">
        <header className="sticky top-0 z-30 flex h-[56px] items-center gap-2.5 border-b border-black/[0.06] bg-[#f3f2ee]/90 px-4 backdrop-blur-xl sm:px-5 dark:border-white/[0.07] dark:bg-[#10100e]/90">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="rounded-xl border border-black/[0.07] bg-white p-2.5 lg:hidden dark:border-white/10 dark:bg-white/5"
          >
            <Menu className="size-4" />
          </button>
          <div className="hidden items-center gap-2 text-xs sm:flex">
            <span className="text-zinc-400">Portfolio</span>
            <ChevronRight className="size-3 text-zinc-300" />
            <span className="font-semibold capitalize">{activeSection}</span>
          </div>
          <div className="relative ml-auto w-full max-w-[260px]">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-zinc-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Quick search…"
              className="h-9 w-full rounded-xl border border-black/[0.06] bg-white pr-3 pl-9 text-xs transition outline-none focus:border-zinc-300 dark:border-white/[0.08] dark:bg-white/[0.04] dark:focus:border-white/20"
            />
          </div>
          <button
            type="button"
            onClick={toggleDarkmode}
            className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-black/[0.06] bg-white transition hover:bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08]"
            aria-label="Toggle color theme"
          >
            {isDarkmode === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <Link
            href="/"
            target="_blank"
            className="hidden h-9 items-center gap-2 rounded-xl bg-zinc-950 px-4 text-[11px] font-semibold text-white transition hover:bg-zinc-800 sm:flex dark:bg-amber-300 dark:text-zinc-950 dark:hover:bg-amber-200"
          >
            <Globe2 className="size-3.5" /> View site
          </Link>
        </header>

        <main className="mx-auto max-w-[1600px] p-3 sm:p-4 lg:p-5">
          {!isReady ? (
            <DashboardSkeleton />
          ) : (
            <>
              {activeSection === 'overview' && (
                <Overview
                  projectCount={content.projects.length}
                  publishedProjectCount={publishedProjects.length}
                  experienceCount={content.experiences.length}
                  publishedExperienceCount={publishedExperiences.length}
                  skillCount={skills.size}
                  projects={content.projects}
                  experiences={content.experiences}
                  onNavigate={goToSection}
                  onNewProject={openNewProject}
                />
              )}
              {activeSection === 'projects' && (
                <ProjectsManager
                  projects={filteredProjects}
                  totalCount={content.projects.length}
                  onCreate={openNewProject}
                  onEdit={(project) => {
                    setIsCreating(false);
                    setProjectEditor({ ...project });
                  }}
                  onDelete={removeProject}
                  onToggleStatus={toggleProjectStatus}
                  onMove={(project, direction) =>
                    moveItem(
                      'projects',
                      content.projects.findIndex((item) => item.id === project.id),
                      direction
                    )
                  }
                />
              )}
              {activeSection === 'experience' && (
                <ExperienceManager
                  experiences={filteredExperiences}
                  onCreate={openNewExperience}
                  onEdit={(experience) => {
                    setIsCreating(false);
                    setExperienceEditor({ ...experience });
                  }}
                  onDelete={removeExperience}
                  onToggleStatus={toggleExperienceStatus}
                  onMove={(experience, direction) =>
                    moveItem(
                      'experiences',
                      content.experiences.findIndex((item) => item.id === experience.id),
                      direction
                    )
                  }
                />
              )}
              {activeSection === 'profile' && (
                <ProfileManager
                  profile={profileDraft}
                  onChange={setProfileDraft}
                  onSubmit={saveProfile}
                />
              )}
              {activeSection === 'toggle' && (
                <ToggleManager
                  toggles={content.toggles}
                  experiences={content.experiences}
                  onToggleNavbarLink={toggleNavbarLink}
                  onToggleExperienceMaster={toggleExperienceMaster}
                  onToggleExperienceItem={toggleIndividualExperienceLink}
                  onEnableAll={enableAllLinks}
                  onDisableAll={disableAllLinks}
                />
              )}
              {activeSection === 'settings' && (
                <SettingsManager onExport={exportContent} onReset={handleReset} />
              )}
            </>
          )}
        </main>
      </div>

      {projectEditor && (
        <ProjectEditor
          project={projectEditor}
          isCreating={isCreating}
          onChange={setProjectEditor}
          onClose={() => setProjectEditor(null)}
          onSubmit={saveProject}
        />
      )}
      {experienceEditor && (
        <ExperienceEditor
          experience={experienceEditor}
          isCreating={isCreating}
          onChange={setExperienceEditor}
          onClose={() => setExperienceEditor(null)}
          onSubmit={saveExperience}
        />
      )}
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-1.5 text-[9px] font-bold tracking-[0.16em] text-zinc-400 uppercase">
          {eyebrow}
        </p>
        <h1 className="text-xl font-semibold tracking-[-0.035em] sm:text-[23px]">{title}</h1>
        <p className="mt-1 max-w-2xl text-[11px] leading-4 text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </div>
      {action}
    </div>
  );
}

function PrimaryButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-[11px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-amber-300 dark:text-zinc-950 dark:hover:bg-amber-200"
    >
      {children}
    </button>
  );
}

function Overview({
  projectCount,
  publishedProjectCount,
  experienceCount,
  publishedExperienceCount,
  skillCount,
  projects,
  experiences,
  onNavigate,
  onNewProject,
}: {
  projectCount: number;
  publishedProjectCount: number;
  experienceCount: number;
  publishedExperienceCount: number;
  skillCount: number;
  projects: ManagedProject[];
  experiences: ManagedExperience[];
  onNavigate: (section: Section) => void;
  onNewProject: () => void;
}) {
  const completion = Math.round(
    ((publishedProjectCount + publishedExperienceCount) /
      Math.max(1, projectCount + experienceCount)) *
      100
  );

  if (projectCount >= 0) {
    return (
      <DenseOverview
        projectCount={projectCount}
        publishedProjectCount={publishedProjectCount}
        experienceCount={experienceCount}
        publishedExperienceCount={publishedExperienceCount}
        skillCount={skillCount}
        projects={projects}
        experiences={experiences}
        onNavigate={onNavigate}
        onNewProject={onNewProject}
      />
    );
  }

  const stats = [
    {
      label: 'Total projects',
      value: projectCount,
      note: `${publishedProjectCount} live`,
      icon: FolderKanban,
      tone: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    },
    {
      label: 'Experience',
      value: experienceCount,
      note: `${publishedExperienceCount} live`,
      icon: BriefcaseBusiness,
      tone: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    },
    {
      label: 'Technologies',
      value: skillCount,
      note: 'Across all projects',
      icon: Sparkles,
      tone: 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300',
    },
    {
      label: 'Content health',
      value: `${completion}%`,
      note: 'Published content',
      icon: BarChart3,
      tone: 'bg-violet-100 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300',
    },
  ];

  return (
    <>
      <PageHeading
        eyebrow="Good to see you"
        title="Portfolio overview"
        description="A quick view of what is live, what needs attention, and the content visitors see."
        action={
          <PrimaryButton onClick={onNewProject}>
            <Plus className="size-3.5" /> Add project
          </PrimaryButton>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className={cn(cardClass, 'p-5')}>
            <div className="flex items-start justify-between">
              <div className={cn('flex size-9 items-center justify-center rounded-xl', stat.tone)}>
                <stat.icon className="size-4" />
              </div>
              <span className="rounded-lg bg-emerald-50 px-2 py-1 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
                Up to date
              </span>
            </div>
            <p className="mt-6 text-[11px] text-zinc-400">{stat.label}</p>
            <div className="mt-1 flex items-end justify-between">
              <p className="text-2xl font-semibold tracking-[-0.04em]">{stat.value}</p>
              <p className="text-[10px] text-zinc-400">{stat.note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_.8fr]">
        <section className={cn(cardClass, 'overflow-hidden')}>
          <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 dark:border-white/[0.07]">
            <div>
              <h2 className="text-sm font-semibold">Recent projects</h2>
              <p className="mt-1 text-[10px] text-zinc-400">Manage your latest published work</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('projects')}
              className="flex items-center gap-1 text-[10px] font-semibold text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
            >
              View all <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {projects.slice(0, 5).map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onNavigate('projects')}
                className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 px-5 py-3.5 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.025]"
              >
                <span className="flex size-8 items-center justify-center rounded-full bg-zinc-100 text-[10px] font-bold dark:bg-white/[0.06]">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{project.title}</span>
                  <span className="mt-1 block truncate text-[10px] text-zinc-400">
                    {project.skills.slice(0, 3).join(' · ')}
                  </span>
                </span>
                <StatusBadge status={project.status} />
              </button>
            ))}
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <section className={cn(cardClass, 'relative overflow-hidden p-5')}>
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-amber-200/40 blur-2xl dark:bg-amber-500/10" />
            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[0.14em] text-amber-600 uppercase dark:text-amber-300">
                  Publishing
                </p>
                <h2 className="mt-2 text-sm font-semibold">Content health</h2>
              </div>
              <div
                className="flex size-20 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#f2b94b ${completion}%, rgba(161,161,170,.18) 0)`,
                }}
              >
                <div className="flex size-14 items-center justify-center rounded-full bg-white text-sm font-bold dark:bg-[#1b1b18]">
                  {completion}%
                </div>
              </div>
            </div>
            <p className="relative mt-3 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
              {completion === 100
                ? 'Everything is published and visible to visitors.'
                : 'You have draft content waiting to be reviewed.'}
            </p>
          </section>
          <section className={cn(cardClass, 'p-5')}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Experience snapshot</h2>
                <p className="mt-1 text-[10px] text-zinc-400">Your current timeline</p>
              </div>
              <BriefcaseBusiness className="size-4 text-zinc-400" />
            </div>
            <div className="mt-4 space-y-3">
              {experiences.slice(0, 3).map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <span className="size-2 rounded-full bg-emerald-400 ring-4 ring-emerald-50 dark:ring-emerald-500/10" />
                  <div className="min-w-0">
                    <p className="truncate text-[11px] font-semibold">{item.role}</p>
                    <p className="truncate text-[9px] text-zinc-400">{item.org}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate('experience')}
              className="mt-5 flex w-full items-center justify-center gap-1 rounded-xl bg-zinc-100 py-2.5 text-[10px] font-semibold transition hover:bg-zinc-200 dark:bg-white/[0.05] dark:hover:bg-white/[0.08]"
            >
              Manage timeline <ArrowLeft className="size-3 rotate-180" />
            </button>
          </section>
        </div>
      </div>
    </>
  );
}

function DenseOverview({
  projectCount,
  publishedProjectCount,
  experienceCount,
  publishedExperienceCount,
  skillCount,
  projects,
  experiences,
  onNavigate,
  onNewProject,
}: {
  projectCount: number;
  publishedProjectCount: number;
  experienceCount: number;
  publishedExperienceCount: number;
  skillCount: number;
  projects: ManagedProject[];
  experiences: ManagedExperience[];
  onNavigate: (section: Section) => void;
  onNewProject: () => void;
}) {
  const totalContent = Math.max(1, projectCount + experienceCount);
  const publishedCount = publishedProjectCount + publishedExperienceCount;
  const completion = Math.round((publishedCount / totalContent) * 100);
  const draftCount = projectCount + experienceCount - publishedCount;
  const skillFrequency = projects.reduce<Record<string, number>>((result, project) => {
    project.skills.forEach((skill) => {
      result[skill] = (result[skill] ?? 0) + 1;
    });
    return result;
  }, {});
  const topSkills = Object.entries(skillFrequency)
    .sort((first, second) => second[1] - first[1])
    .slice(0, 5);
  const maxSkillCount = Math.max(1, ...topSkills.map(([, count]) => count));
  const today = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date());

  return (
    <>
      <PageHeading
        eyebrow="Workspace overview"
        title="Portfolio dashboard"
        description={`Content status, activity and portfolio health at a glance · ${today}`}
        action={
          <PrimaryButton onClick={onNewProject}>
            <Plus className="size-3.5" /> Add project
          </PrimaryButton>
        }
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1.12fr]">
        <MetricSummary
          icon={FolderKanban}
          label="Projects"
          value={projectCount}
          unit="total"
          note={`${publishedProjectCount} published on your site`}
          accent="amber"
          bars={[34, 52, 46, 72, 86]}
        />
        <MetricSummary
          icon={BriefcaseBusiness}
          label="Experience"
          value={experienceCount}
          unit="roles"
          note={`${publishedExperienceCount} visible on your timeline`}
          accent="emerald"
          bars={[38, 64, 48, 76, 58]}
        />
        <section
          className={cn(
            cardClass,
            'flex min-h-[116px] items-center justify-between p-4 md:col-span-2 xl:col-span-1'
          )}
        >
          <div className="min-w-[130px]">
            <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
              <BarChart3 className="size-3.5" /> Content distribution
            </div>
            <div className="mt-4 space-y-2">
              <ChartLegend color="bg-emerald-400" label="Published" value={publishedCount} />
              <ChartLegend color="bg-amber-400" label="Drafts" value={draftCount} />
              <ChartLegend color="bg-sky-400" label="Technologies" value={skillCount} />
            </div>
          </div>
          <div
            className="flex size-[82px] shrink-0 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#34d399 0 ${completion * 0.72}%, #fbbf24 ${completion * 0.72}% ${Math.min(100, completion * 0.72 + Math.max(4, draftCount * 4))}%, #60a5fa 0)`,
            }}
          >
            <div className="flex size-[57px] flex-col items-center justify-center rounded-full bg-white dark:bg-[#1b1b18]">
              <span className="text-sm font-bold">{completion}%</span>
              <span className="text-[8px] text-zinc-400">healthy</span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1fr_1.08fr_1fr]">
        <section className={cn(cardClass, 'flex min-h-[190px] flex-col p-4')}>
          <PanelTitle icon={BarChart3} title="Technology mix" meta={`${skillCount} skills`} />
          <div className="mt-auto flex h-[118px] items-end justify-between gap-2 border-b border-black/[0.06] px-1 dark:border-white/[0.08]">
            {topSkills.map(([skill, count], index) => (
              <div
                key={skill}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span className="text-[8px] font-semibold text-zinc-400">{count}</span>
                <div
                  className={cn(
                    'w-full max-w-12 rounded-t-[8px]',
                    index === 0
                      ? 'bg-emerald-400'
                      : index === 1
                        ? 'bg-amber-400'
                        : index === 2
                          ? 'bg-rose-400'
                          : index === 3
                            ? 'bg-lime-300'
                            : 'bg-sky-400'
                  )}
                  style={{ height: `${32 + (count / maxSkillCount) * 54}px` }}
                />
                <span className="w-full truncate pb-1 text-center text-[8px] text-zinc-400">
                  {skill}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className={cn(cardClass, 'min-h-[190px] overflow-hidden')}>
          <div className="px-4 pt-4">
            <PanelTitle
              icon={BriefcaseBusiness}
              title="Experience timeline"
              meta={`${experienceCount} roles`}
            />
          </div>
          <div className="mt-2 divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {experiences.slice(0, 3).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('experience')}
                className={cn(
                  'grid w-full grid-cols-[46px_1fr_auto] items-center gap-2 px-4 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.025]',
                  index === 0 && 'bg-amber-50/70 dark:bg-amber-400/[0.04]'
                )}
              >
                <span className="text-[9px] leading-3 text-zinc-400">
                  {item.duration.split('-')[0].trim().slice(0, 8)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[10px] font-semibold">{item.role}</span>
                  <span className="mt-0.5 block truncate text-[8px] text-zinc-400">{item.org}</span>
                </span>
                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        </section>

        <section
          className={cn(
            cardClass,
            'relative min-h-[190px] overflow-hidden bg-gradient-to-br from-white via-white to-amber-50 p-4 dark:from-[#1b1b18] dark:via-[#1b1b18] dark:to-amber-500/[0.08]'
          )}
        >
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-amber-200/35 blur-3xl dark:bg-amber-500/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-amber-600 dark:text-amber-300">
              <Sparkles className="size-3.5" /> Portfolio insight
            </div>
            <span className="rounded-md bg-white/70 px-2 py-1 text-[8px] text-zinc-400 dark:bg-white/[0.05]">
              Live
            </span>
          </div>
          <div className="relative mt-8">
            <p className="text-[11px] leading-[1.55] font-semibold">
              {completion === 100
                ? 'Your portfolio is fully published. Keep your strongest three projects featured and refresh outcome-focused copy regularly.'
                : `You have ${draftCount} draft ${draftCount === 1 ? 'item' : 'items'} waiting. Publish completed work to keep the portfolio current.`}
            </p>
            <p className="mt-3 text-[9px] leading-4 text-zinc-400">
              TypeScript appears most often across your work, giving your portfolio a clear
              technical focus.
            </p>
            <div className="mt-5 h-1 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-3 grid gap-3 xl:grid-cols-[1.1fr_.9fr]">
        <section className={cn(cardClass, 'overflow-hidden')}>
          <TableHeader
            icon={FolderKanban}
            title="Projects"
            actionLabel="Manage all"
            onAction={() => onNavigate('projects')}
          />
          <div className="grid grid-cols-[1.25fr_.9fr_80px] gap-3 border-y border-black/[0.05] bg-zinc-50/60 px-4 py-2 text-[8px] font-bold tracking-[0.1em] text-zinc-400 uppercase dark:border-white/[0.06] dark:bg-white/[0.02]">
            <span>Project</span>
            <span>Stack</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {projects.slice(0, 4).map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => onNavigate('projects')}
                className="grid w-full grid-cols-[1.25fr_.9fr_80px] items-center gap-3 px-4 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.025]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-[8px] font-bold dark:bg-white/[0.06]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-semibold">
                      {project.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[8px] text-zinc-400">
                      {project.featured ? 'Featured project' : 'Portfolio project'}
                    </span>
                  </span>
                </span>
                <span className="truncate text-[9px] text-zinc-400">
                  {project.skills.slice(0, 3).join(' · ')}
                </span>
                <StatusBadge status={project.status} />
              </button>
            ))}
          </div>
        </section>

        <section className={cn(cardClass, 'overflow-hidden')}>
          <TableHeader
            icon={BriefcaseBusiness}
            title="Experience"
            actionLabel="Edit timeline"
            onAction={() => onNavigate('experience')}
          />
          <div className="grid grid-cols-[1.2fr_.9fr_80px] gap-3 border-y border-black/[0.05] bg-zinc-50/60 px-4 py-2 text-[8px] font-bold tracking-[0.1em] text-zinc-400 uppercase dark:border-white/[0.06] dark:bg-white/[0.02]">
            <span>Role</span>
            <span>Organization</span>
            <span>Status</span>
          </div>
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {experiences.slice(0, 4).map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate('experience')}
                className="grid w-full grid-cols-[1.2fr_.9fr_80px] items-center gap-3 px-4 py-2.5 text-left transition hover:bg-zinc-50 dark:hover:bg-white/[0.025]"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={cn(
                      'flex size-7 shrink-0 items-center justify-center rounded-full text-[8px] font-bold',
                      index % 2 === 0
                        ? 'bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300'
                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                    )}
                  >
                    {item.role.slice(0, 2).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[10px] font-semibold">{item.role}</span>
                    <span className="mt-0.5 block truncate text-[8px] text-zinc-400">
                      {item.duration}
                    </span>
                  </span>
                </span>
                <span className="truncate text-[9px] text-zinc-400">{item.org}</span>
                <StatusBadge status={item.status} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

function MetricSummary({
  icon: Icon,
  label,
  value,
  unit,
  note,
  accent,
  bars,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
  unit: string;
  note: string;
  accent: 'amber' | 'emerald';
  bars: number[];
}) {
  return (
    <section
      className={cn(
        cardClass,
        'flex min-h-[116px] items-stretch justify-between overflow-hidden p-4'
      )}
    >
      <div className="flex flex-col justify-between">
        <div className="flex items-center gap-2 text-[10px] font-medium text-zinc-400">
          <Icon className="size-3.5" /> {label}
        </div>
        <div>
          <p className="flex items-end gap-1.5">
            <span className="text-[24px] font-semibold tracking-[-0.05em]">{value}</span>
            <span className="pb-1 text-[9px] text-zinc-400">{unit}</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-[8px] text-zinc-400">
            <span
              className={cn(
                'rounded px-1.5 py-0.5 font-bold',
                accent === 'amber'
                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
              )}
            >
              Live
            </span>
            {note}
          </p>
        </div>
      </div>
      <div className="flex w-20 items-end justify-end gap-1.5 border-b border-black/[0.05] pb-px dark:border-white/[0.07]">
        {bars.map((height, index) => (
          <span
            key={index}
            className={cn(
              'w-2 rounded-t-sm',
              accent === 'amber' ? 'bg-amber-400' : 'bg-emerald-400'
            )}
            style={{ height: `${height}%`, opacity: 0.38 + index * 0.14 }}
          />
        ))}
      </div>
    </section>
  );
}

function ChartLegend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2 text-[9px]">
      <span className={cn('size-1.5 rounded-full', color)} />
      <span className="text-zinc-400">{label}</span>
      <span className="ml-auto font-semibold">{value}</span>
    </div>
  );
}

function PanelTitle({
  icon: Icon,
  title,
  meta,
}: {
  icon: LucideIcon;
  title: string;
  meta: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-semibold">
        <Icon className="size-3.5 text-zinc-400" /> {title}
      </div>
      <span className="rounded-md bg-zinc-100 px-2 py-1 text-[8px] text-zinc-400 dark:bg-white/[0.05]">
        {meta}
      </span>
    </div>
  );
}

function TableHeader({
  icon: Icon,
  title,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center gap-2 text-[11px] font-semibold">
        <Icon className="size-3.5 text-zinc-400" /> {title}
      </div>
      <button
        type="button"
        onClick={onAction}
        className="flex items-center gap-1 text-[8px] font-semibold text-zinc-400 transition hover:text-zinc-900 dark:hover:text-white"
      >
        {actionLabel} <ChevronRight className="size-3" />
      </button>
    </div>
  );
}

function ProjectsManager({
  projects,
  totalCount,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
  onMove,
}: {
  projects: ManagedProject[];
  totalCount: number;
  onCreate: () => void;
  onEdit: (project: ManagedProject) => void;
  onDelete: (project: ManagedProject) => void;
  onToggleStatus: (project: ManagedProject) => void;
  onMove: (project: ManagedProject, direction: -1 | 1) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Content library"
        title="Projects"
        description={`${totalCount} projects in your portfolio. Search, reorder, edit, or control what is visible.`}
        action={
          <PrimaryButton onClick={onCreate}>
            <Plus className="size-3.5" /> New project
          </PrimaryButton>
        }
      />
      <section className={cn(cardClass, 'overflow-hidden')}>
        <div className="hidden grid-cols-[minmax(200px,1.5fr)_minmax(180px,1fr)_100px_160px] gap-4 border-b border-black/[0.06] px-5 py-3 text-[9px] font-bold tracking-[0.12em] text-zinc-400 uppercase md:grid dark:border-white/[0.07]">
          <span>Project</span>
          <span>Technology</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>
        <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
          {projects.map((project) => (
            <div
              key={project.id}
              className="grid gap-4 px-4 py-4 transition hover:bg-zinc-50 md:grid-cols-[minmax(200px,1.5fr)_minmax(180px,1fr)_100px_160px] md:items-center md:px-5 dark:hover:bg-white/[0.02]"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 text-sm font-bold text-amber-800 dark:from-amber-500/15 dark:to-orange-500/10 dark:text-amber-300">
                  {project.title.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold">{project.title}</p>
                  <p className="mt-1 truncate text-[10px] text-zinc-400">{project.desc}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-[9px] text-zinc-500 dark:bg-white/[0.05] dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="px-1 py-1 text-[9px] text-zinc-400">
                    +{project.skills.length - 3}
                  </span>
                )}
              </div>
              <StatusBadge status={project.status} />
              <div className="flex items-center justify-start gap-1 md:justify-end">
                <IconButton label="Move up" onClick={() => onMove(project, -1)}>
                  <ArrowUp className="size-3.5" />
                </IconButton>
                <IconButton label="Move down" onClick={() => onMove(project, 1)}>
                  <ArrowDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label={project.status === 'published' ? 'Unpublish' : 'Publish'}
                  onClick={() => onToggleStatus(project)}
                >
                  {project.status === 'published' ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </IconButton>
                <IconButton label="Edit project" onClick={() => onEdit(project)}>
                  <PencilLine className="size-3.5" />
                </IconButton>
                <IconButton label="Delete project" danger onClick={() => onDelete(project)}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <EmptyState
              title="No projects found"
              description="Try another search or create a new project."
            />
          )}
        </div>
      </section>
    </>
  );
}

function ExperienceManager({
  experiences,
  onCreate,
  onEdit,
  onDelete,
  onToggleStatus,
  onMove,
}: {
  experiences: ManagedExperience[];
  onCreate: () => void;
  onEdit: (experience: ManagedExperience) => void;
  onDelete: (experience: ManagedExperience) => void;
  onToggleStatus: (experience: ManagedExperience) => void;
  onMove: (experience: ManagedExperience, direction: -1 | 1) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Career timeline"
        title="Experience"
        description="Keep your roles, dates, companies, and achievement bullets current."
        action={
          <PrimaryButton onClick={onCreate}>
            <Plus className="size-3.5" /> Add experience
          </PrimaryButton>
        }
      />
      <div className="space-y-3">
        {experiences.map((item, index) => (
          <section key={item.id} className={cn(cardClass, 'relative overflow-hidden p-5 sm:p-6')}>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-amber-300 to-emerald-300" />
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <div className="flex min-w-0 flex-1 gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-zinc-100 text-xs font-bold dark:bg-white/[0.06]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold">{item.role}</h2>
                    <StatusBadge status={item.status} />
                  </div>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-300">{item.org}</p>
                  <p className="mt-1 text-[10px] text-zinc-400">{item.duration}</p>
                  <ul className="mt-4 space-y-2">
                    {item.desc?.slice(0, 3).map((bullet, bulletIndex) => (
                      <li
                        key={bulletIndex}
                        className="flex gap-2 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400"
                      >
                        <Check className="mt-1 size-3 shrink-0 text-emerald-500" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 pl-14 lg:pl-0">
                <IconButton label="Move up" onClick={() => onMove(item, -1)}>
                  <ArrowUp className="size-3.5" />
                </IconButton>
                <IconButton label="Move down" onClick={() => onMove(item, 1)}>
                  <ArrowDown className="size-3.5" />
                </IconButton>
                <IconButton
                  label={item.status === 'published' ? 'Unpublish' : 'Publish'}
                  onClick={() => onToggleStatus(item)}
                >
                  {item.status === 'published' ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </IconButton>
                <IconButton label="Edit experience" onClick={() => onEdit(item)}>
                  <PencilLine className="size-3.5" />
                </IconButton>
                <IconButton label="Delete experience" danger onClick={() => onDelete(item)}>
                  <Trash2 className="size-3.5" />
                </IconButton>
              </div>
            </div>
          </section>
        ))}
        {experiences.length === 0 && (
          <div className={cardClass}>
            <EmptyState
              title="No experience found"
              description="Try another search or add your first role."
            />
          </div>
        )}
      </div>
    </>
  );
}

function ProfileManager({
  profile,
  onChange,
  onSubmit,
}: {
  profile: PortfolioProfile;
  onChange: (profile: PortfolioProfile) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <>
      <PageHeading
        eyebrow="Personal details"
        title="Profile"
        description="Update the introduction and availability shown in your portfolio hero."
      />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <form onSubmit={onSubmit} className={cn(cardClass, 'p-5 sm:p-7')}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Display name">
              <input
                className={inputClass}
                value={profile.name}
                onChange={(event) => onChange({ ...profile, name: event.target.value })}
                required
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={profile.role}
                onChange={(event) => onChange({ ...profile, role: event.target.value })}
                required
              />
            </Field>
            <Field label="Handle">
              <input
                className={inputClass}
                value={profile.handle}
                onChange={(event) => onChange({ ...profile, handle: event.target.value })}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputClass}
                value={profile.location}
                onChange={(event) => onChange({ ...profile, location: event.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Hero introduction">
                <textarea
                  rows={5}
                  className={inputClass}
                  value={profile.intro}
                  onChange={(event) => onChange({ ...profile, intro: event.target.value })}
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Availability">
                <input
                  className={inputClass}
                  value={profile.availability}
                  onChange={(event) => onChange({ ...profile, availability: event.target.value })}
                />
              </Field>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-5 text-xs font-semibold text-white dark:bg-amber-300 dark:text-zinc-950"
            >
              <Check className="size-3.5" /> Save profile
            </button>
          </div>
        </form>
        <section className={cn(cardClass, 'p-5')}>
          <p className="text-[10px] font-bold tracking-[0.15em] text-zinc-400 uppercase">
            Live preview
          </p>
          <div className="mt-5 overflow-hidden rounded-[24px] bg-gradient-to-br from-cyan-100 via-white to-emerald-100 p-6 dark:from-cyan-950 dark:via-zinc-900 dark:to-emerald-950">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-950 text-lg font-bold text-white dark:bg-white dark:text-zinc-950">
              {profile.name
                .split(' ')
                .map((word) => word[0])
                .join('')
                .slice(0, 2)}
            </div>
            <p className="mt-6 text-xl font-semibold tracking-[-0.04em]">
              {profile.name || 'Your name'}
            </p>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-300">
              {profile.role || 'Your role'}
            </p>
            <p className="mt-4 text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
              {profile.intro || 'Your introduction will appear here.'}
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-2 text-[9px] font-semibold shadow-sm dark:bg-white/10">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              {profile.availability || 'Availability'}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function SettingsManager({ onExport, onReset }: { onExport: () => void; onReset: () => void }) {
  return (
    <>
      <PageHeading
        eyebrow="Workspace"
        title="Settings"
        description="Manage local content backups and restore the original portfolio data."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <section className={cn(cardClass, 'p-6')}>
          <div className="flex size-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
            <Download className="size-4" />
          </div>
          <h2 className="mt-5 text-sm font-semibold">Export a backup</h2>
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Download every project, role, and profile setting as a JSON file.
          </p>
          <button
            type="button"
            onClick={onExport}
            className="mt-6 flex items-center gap-2 rounded-xl bg-zinc-100 px-4 py-3 text-xs font-semibold transition hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
          >
            <Download className="size-3.5" /> Export content
          </button>
        </section>
        <section className={cn(cardClass, 'p-6')}>
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-300">
            <RotateCcw className="size-4" />
          </div>
          <h2 className="mt-5 text-sm font-semibold">Restore original content</h2>
          <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
            Discard browser edits and reload the content that ships with the portfolio.
          </p>
          <button
            type="button"
            onClick={onReset}
            className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-xs font-semibold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/15"
          >
            <RotateCcw className="size-3.5" /> Reset to defaults
          </button>
        </section>
        <section className={cn(cardClass, 'p-6 md:col-span-2')}>
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
              <Settings className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold">Storage for this version</h2>
              <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                Dashboard edits are saved in this browser and are reflected on the public portfolio
                on this device. Connecting a database later will make the same content available
                across devices and deployments.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
  disabled = false,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-900',
        checked ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-zinc-300 dark:bg-zinc-700',
        disabled && 'cursor-not-allowed opacity-40'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

function ToggleManager({
  toggles,
  experiences,
  onToggleNavbarLink,
  onToggleExperienceMaster,
  onToggleExperienceItem,
  onEnableAll,
  onDisableAll,
}: {
  toggles: LinkToggles;
  experiences: ManagedExperience[];
  onToggleNavbarLink: (key: 'navbarResume' | 'navbarGithub' | 'navbarLinkedin') => void;
  onToggleExperienceMaster: () => void;
  onToggleExperienceItem: (id: string, org: string) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
}) {
  const isMasterCompanyEnabled = toggles?.experienceCompanyLinks !== false;

  const navbarLinks = [
    {
      key: 'navbarResume' as const,
      label: 'Resume',
      icon: FileText,
      description: 'Document viewer link in the floating navigation dock',
      url: 'https://drive.google.com/file/d/1pR99zYg5kWPzvEL0cXL11mmj1vc7KYtw/view',
      enabled: toggles?.navbarResume !== false,
      badgeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
    },
    {
      key: 'navbarGithub' as const,
      label: 'GitHub Profile',
      icon: Github,
      description: 'Public repositories & code activity (@satishydv)',
      url: 'https://github.com/satishydv',
      enabled: toggles?.navbarGithub !== false,
      badgeColor: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200',
    },
    {
      key: 'navbarLinkedin' as const,
      label: 'LinkedIn Profile',
      icon: Linkedin,
      description: 'Professional networking and career profile',
      url: 'https://www.linkedin.com/in/thesatishydv/',
      enabled: toggles?.navbarLinkedin !== false,
      badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
  ];

  const activeNavbarCount = navbarLinks.filter((item) => item.enabled).length;

  const companyList = experiences.map((exp) => {
    const isIndividuallyDisabled =
      Boolean(exp.id && toggles?.disabledExperienceLinks?.[exp.id]) ||
      Boolean(toggles?.disabledExperienceLinks?.[exp.org]);
    const isEnabled = isMasterCompanyEnabled && !isIndividuallyDisabled && Boolean(exp.link);
    return {
      ...exp,
      isIndividuallyDisabled,
      isEnabled,
    };
  });

  const activeCompanyCount = companyList.filter((item) => item.isEnabled).length;
  const totalCompanyLinks = companyList.filter((item) => Boolean(item.link)).length;

  return (
    <>
      <PageHeading
        eyebrow="Workspace controls"
        title="Link Toggles"
        description="Turn external links on or off across your portfolio navbar and experience company cards. When turned off, links stay visible to maintain design continuity, while clicking is disabled."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onEnableAll}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
            >
              <Check className="size-3.5 text-emerald-500" />
              Enable all links
            </button>
            <button
              type="button"
              onClick={onDisableAll}
              className="flex h-9 items-center gap-1.5 rounded-xl border border-black/[0.08] bg-white px-3.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-white/10 dark:bg-white/5 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <X className="size-3.5" />
              Turn off all
            </button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-3 sm:grid-cols-3">
        <section className={cn(cardClass, 'p-4 sm:p-5')}>
          <div className="flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
              <ExternalLink className="size-4" />
            </div>
            <span
              className={cn(
                'rounded-lg px-2 py-0.5 text-[9px] font-bold',
                activeNavbarCount === 3
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
              )}
            >
              {activeNavbarCount === 3 ? 'All active' : `${3 - activeNavbarCount} disabled`}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-zinc-400">Navbar floating dock</p>
          <div className="mt-0.5 flex items-baseline justify-between">
            <p className="text-xl font-bold tracking-tight">
              {activeNavbarCount} / 3 <span className="text-xs font-normal text-zinc-400">on</span>
            </p>
            <span className="text-[10px] text-zinc-400">Resume, GitHub, LinkedIn</span>
          </div>
        </section>

        <section className={cn(cardClass, 'p-4 sm:p-5')}>
          <div className="flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
              <BriefcaseBusiness className="size-4" />
            </div>
            <span
              className={cn(
                'rounded-lg px-2 py-0.5 text-[9px] font-bold',
                isMasterCompanyEnabled
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                  : 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300'
              )}
            >
              {isMasterCompanyEnabled ? 'Master: ON' : 'Master: OFF'}
            </span>
          </div>
          <p className="mt-3 text-[11px] text-zinc-400">Experience company links</p>
          <div className="mt-0.5 flex items-baseline justify-between">
            <p className="text-xl font-bold tracking-tight">
              {activeCompanyCount} / {totalCompanyLinks}{' '}
              <span className="text-xs font-normal text-zinc-400">active</span>
            </p>
            <span className="text-[10px] text-zinc-400">Company logos</span>
          </div>
        </section>

        <section className={cn(cardClass, 'p-4 sm:p-5')}>
          <div className="flex items-center justify-between">
            <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              <ShieldCheck className="size-4" />
            </div>
            <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300">
              Safe mode
            </span>
          </div>
          <p className="mt-3 text-[11px] text-zinc-400">Turned-off link behavior</p>
          <div className="mt-0.5 flex items-baseline justify-between">
            <p className="text-xl font-bold tracking-tight">Click-Disabled</p>
            <span className="text-[10px] text-zinc-400">Keeps icons visible</span>
          </div>
        </section>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Navbar Links Section */}
        <section className={cn(cardClass, 'overflow-hidden')}>
          <div className="border-b border-black/[0.06] p-5 dark:border-white/[0.07]">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300">
                <SlidersHorizontal className="size-4" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">Navbar floating dock links</h2>
                <p className="text-[10px] text-zinc-400">
                  Control external links in the top floating dock
                </p>
              </div>
            </div>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {navbarLinks.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between gap-3 p-4.5 transition hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-xl',
                      item.badgeColor
                    )}
                  >
                    <item.icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold">{item.label}</p>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold',
                          item.enabled
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            item.enabled ? 'bg-emerald-500' : 'bg-zinc-400'
                          )}
                        />
                        {item.enabled ? 'Link active' : 'Link disabled'}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                    <div className="mt-1.5 flex items-center gap-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex max-w-[280px] items-center gap-1 truncate font-mono text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                        title={item.url}
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="size-2.5 shrink-0 opacity-70" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <ToggleSwitch
                    checked={item.enabled}
                    onChange={() => onToggleNavbarLink(item.key)}
                    label={`Toggle ${item.label}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Company Links Section */}
        <section className={cn(cardClass, 'overflow-hidden')}>
          <div className="border-b border-black/[0.06] p-5 dark:border-white/[0.07]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-700 dark:text-amber-300">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold">Experience company links</h2>
                  <p className="text-[10px] text-zinc-400">
                    Control company website links on experience cards
                  </p>
                </div>
              </div>
            </div>

            {/* Master Switch Banner */}
            <div className="mt-4 flex items-center justify-between rounded-xl border border-black/[0.06] bg-amber-500/[0.06] p-3 dark:border-white/[0.08] dark:bg-amber-400/[0.05]">
              <div>
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  Global company links master switch
                </p>
                <p className="mt-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
                  Turn off to disable all company website links across the experience section
                </p>
              </div>
              <ToggleSwitch
                checked={isMasterCompanyEnabled}
                onChange={onToggleExperienceMaster}
                label="Toggle all company links"
              />
            </div>
          </div>

          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.06]">
            {companyList.map((exp) => (
              <div
                key={exp.id || exp.org}
                className="flex items-center justify-between gap-3 p-4.5 transition hover:bg-black/[0.015] dark:hover:bg-white/[0.015]"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-black/[0.08] bg-zinc-100 dark:border-white/10 dark:bg-white/5">
                    {exp.logo ? (
                      <Image
                        src={exp.logo}
                        alt={exp.org}
                        width={40}
                        height={40}
                        className={cn(
                          'size-full object-contain',
                          !exp.isEnabled && 'opacity-60 grayscale-[60%]'
                        )}
                        onError={(e) => {
                          // Hide broken image
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <Building2 className="size-4 text-zinc-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-xs font-bold">{exp.org}</p>
                      <span className="text-[10px] text-zinc-400">· {exp.role}</span>
                      <span
                        className={cn(
                          'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold',
                          exp.isEnabled
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : !isMasterCompanyEnabled
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
                              : 'bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'
                        )}
                      >
                        <span
                          className={cn(
                            'size-1.5 rounded-full',
                            exp.isEnabled
                              ? 'bg-emerald-500'
                              : !isMasterCompanyEnabled
                                ? 'bg-amber-400'
                                : 'bg-zinc-400'
                          )}
                        />
                        {exp.isEnabled
                          ? 'Active'
                          : !isMasterCompanyEnabled
                            ? 'Turned off by master'
                            : 'Disabled'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[10px] text-zinc-400">{exp.duration}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {exp.link ? (
                        <a
                          href={exp.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex max-w-[280px] items-center gap-1 truncate font-mono text-[10px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title={exp.link}
                        >
                          <span className="truncate">{exp.link}</span>
                          <ExternalLink className="size-2.5 shrink-0 opacity-70" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-zinc-400 italic">No URL configured</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 pl-2">
                  <ToggleSwitch
                    checked={!exp.isIndividuallyDisabled}
                    disabled={!isMasterCompanyEnabled}
                    onChange={() => onToggleExperienceItem(exp.id, exp.org)}
                    label={`Toggle ${exp.org} link`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Interactive Live Preview Card */}
      <section className={cn(cardClass, 'mt-4 p-5 sm:p-6')}>
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold">Live interaction test & preview</h2>
            <p className="text-[11px] text-zinc-400">
              Click any element below to test how it responds in the current toggle state.
            </p>
          </div>
          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300">
            Real-time reflection
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {/* Dock Preview */}
          <div className="rounded-2xl border border-black/[0.06] bg-zinc-100/70 p-5 text-center dark:border-white/[0.08] dark:bg-white/[0.02]">
            <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-zinc-400 uppercase">
              Navbar floating dock preview
            </p>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 p-2 shadow-lg backdrop-blur-md dark:border-white/20 dark:bg-zinc-900/80">
              {navbarLinks.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    if (item.enabled) {
                      toast.success(`${item.label} link is ACTIVE: will open in new tab!`);
                      window.open(item.url, '_blank');
                    } else {
                      toast.info(
                        `${item.label} link is TURNED OFF: clicking does not navigate on site.`
                      );
                    }
                  }}
                  className={cn(
                    'relative flex size-9 items-center justify-center rounded-full border transition-all duration-200',
                    item.enabled
                      ? 'border-black/10 bg-white shadow-sm hover:scale-110 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/20'
                      : 'cursor-not-allowed border-dashed border-zinc-300 bg-zinc-100/50 opacity-40 grayscale-[80%] dark:border-zinc-700 dark:bg-white/5'
                  )}
                  title={item.enabled ? `${item.label} (Active)` : `${item.label} (Disabled)`}
                >
                  <item.icon className="size-4" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-[10px] text-zinc-400">
              {activeNavbarCount === 3
                ? 'All 3 links are active and functional.'
                : `${3 - activeNavbarCount} of 3 navbar links are turned off.`}
            </p>
          </div>

          {/* Company Card Preview */}
          <div className="rounded-2xl border border-black/[0.06] bg-zinc-100/70 p-5 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <p className="mb-3 text-[10px] font-bold tracking-[0.14em] text-zinc-400 uppercase">
              Experience card company logo preview
            </p>
            {companyList[0] && (
              <div className="flex items-center gap-3 rounded-xl border border-black/[0.05] bg-white p-3.5 shadow-sm dark:border-white/[0.08] dark:bg-[#1b1b18]">
                <button
                  type="button"
                  onClick={() => {
                    if (companyList[0].isEnabled) {
                      toast.success(
                        `${companyList[0].org} link is ACTIVE: will open ${companyList[0].link}`
                      );
                      if (companyList[0].link) window.open(companyList[0].link, '_blank');
                    } else {
                      toast.info(
                        `${companyList[0].org} link is TURNED OFF: clicking does not navigate.`
                      );
                    }
                  }}
                  className={cn(
                    'group relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border transition-transform',
                    companyList[0].isEnabled
                      ? 'border-emerald-200 hover:scale-105 dark:border-emerald-500/30'
                      : 'cursor-not-allowed border-dashed border-zinc-300 opacity-60 grayscale-[60%] dark:border-zinc-700'
                  )}
                  title={
                    companyList[0].isEnabled
                      ? `Visit ${companyList[0].org}`
                      : `${companyList[0].org} (Website link disabled)`
                  }
                >
                  {companyList[0].logo ? (
                    <Image
                      src={companyList[0].logo}
                      alt={companyList[0].org}
                      width={48}
                      height={48}
                      className="size-full object-contain"
                    />
                  ) : (
                    <Building2 className="size-5" />
                  )}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold">{companyList[0].role}</p>
                    <span className="text-[10px] text-zinc-400">{companyList[0].duration}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {companyList[0].org}
                  </p>
                  <p className="mt-1 text-[10px] font-semibold text-zinc-400">
                    Status:{' '}
                    <span
                      className={companyList[0].isEnabled ? 'text-emerald-500' : 'text-amber-500'}
                    >
                      {companyList[0].isEnabled ? 'Clickable' : 'Navigation disabled'}
                    </span>
                  </p>
                </div>
              </div>
            )}
            <p className="mt-3 text-[10px] text-zinc-400">
              {isMasterCompanyEnabled
                ? 'Master toggle is ON. Individual company controls take effect.'
                : 'Master toggle is OFF. All company links are safely disabled.'}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function ProjectEditor({
  project,
  isCreating,
  onChange,
  onClose,
  onSubmit,
}: {
  project: ManagedProject;
  isCreating: boolean;
  onChange: (project: ManagedProject) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <EditorShell
      title={isCreating ? 'Create project' : 'Edit project'}
      description="Update the details shown on your project cards."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <Field label="Project title">
          <input
            required
            className={inputClass}
            value={project.title}
            onChange={(event) => onChange({ ...project, title: event.target.value })}
            placeholder="e.g. GitTale"
          />
        </Field>
        <Field label="Description">
          <textarea
            required
            rows={5}
            className={inputClass}
            value={project.desc}
            onChange={(event) => onChange({ ...project, desc: event.target.value })}
            placeholder="What did you build?"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Live website">
            <input
              type="url"
              className={inputClass}
              value={project.webLink}
              onChange={(event) => onChange({ ...project, webLink: event.target.value })}
              placeholder="https://"
            />
          </Field>
          <Field label="Source code">
            <input
              type="url"
              className={inputClass}
              value={project.srcLink}
              onChange={(event) => onChange({ ...project, srcLink: event.target.value })}
              placeholder="https://github.com/"
            />
          </Field>
        </div>
        <Field label="Technologies (comma separated)">
          <input
            className={inputClass}
            value={project.skills.join(', ')}
            onChange={(event) =>
              onChange({
                ...project,
                skills: event.target.value
                  .split(',')
                  .map((skill) => skill.trim())
                  .filter(Boolean),
              })
            }
            placeholder="React, TypeScript, Node.js"
          />
        </Field>
        <Field label="Image path">
          <input
            className={inputClass}
            value={String(project.imgLink)}
            onChange={(event) => onChange({ ...project, imgLink: event.target.value })}
            placeholder="/projects/image.webp"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publishing status">
            <select
              className={inputClass}
              value={project.status}
              onChange={(event) =>
                onChange({ ...project, status: event.target.value as PublishStatus })
              }
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <Field label="Project type">
            <label className="flex h-[46px] cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 text-sm dark:border-white/10 dark:bg-white/5">
              <input
                type="checkbox"
                checked={project.featured}
                onChange={(event) => onChange({ ...project, featured: event.target.checked })}
                className="accent-amber-500"
              />{' '}
              Featured project
            </label>
          </Field>
        </div>
        <EditorActions
          onClose={onClose}
          submitLabel={isCreating ? 'Create project' : 'Save changes'}
        />
      </form>
    </EditorShell>
  );
}

function ExperienceEditor({
  experience,
  isCreating,
  onChange,
  onClose,
  onSubmit,
}: {
  experience: ManagedExperience;
  isCreating: boolean;
  onChange: (experience: ManagedExperience) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <EditorShell
      title={isCreating ? 'Add experience' : 'Edit experience'}
      description="Keep your career timeline clear and outcome-focused."
      onClose={onClose}
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company / organization">
            <input
              required
              className={inputClass}
              value={experience.org}
              onChange={(event) => onChange({ ...experience, org: event.target.value })}
            />
          </Field>
          <Field label="Role">
            <input
              required
              className={inputClass}
              value={experience.role}
              onChange={(event) => onChange({ ...experience, role: event.target.value })}
            />
          </Field>
        </div>
        <Field label="Duration">
          <input
            required
            className={inputClass}
            value={experience.duration}
            onChange={(event) => onChange({ ...experience, duration: event.target.value })}
            placeholder="September 2025 – Present"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company website">
            <input
              type="url"
              className={inputClass}
              value={experience.link}
              onChange={(event) => onChange({ ...experience, link: event.target.value })}
              placeholder="https://"
            />
          </Field>
          <Field label="Logo path">
            <input
              className={inputClass}
              value={experience.logo}
              onChange={(event) => onChange({ ...experience, logo: event.target.value })}
              placeholder="/company/logo.png"
            />
          </Field>
        </div>
        <Field label="Achievements (one per line)">
          <textarea
            rows={7}
            className={inputClass}
            value={experience.desc?.join('\n') ?? ''}
            onChange={(event) =>
              onChange({ ...experience, desc: event.target.value.split('\n').filter(Boolean) })
            }
            placeholder="Built and shipped…&#10;Improved performance by…"
          />
        </Field>
        <Field label="Publishing status">
          <select
            className={inputClass}
            value={experience.status}
            onChange={(event) =>
              onChange({ ...experience, status: event.target.value as PublishStatus })
            }
          >
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </Field>
        <EditorActions
          onClose={onClose}
          submitLabel={isCreating ? 'Add experience' : 'Save changes'}
        />
      </form>
    </EditorShell>
  );
}

function EditorShell({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex justify-end bg-black/35 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close editor"
      />
      <section className="relative h-full w-full max-w-[590px] overflow-y-auto bg-white p-5 shadow-2xl sm:p-8 dark:bg-[#191916]">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.16em] text-amber-600 uppercase dark:text-amber-300">
              Content editor
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">{title}</h2>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 transition hover:bg-zinc-200 dark:bg-white/[0.06] dark:hover:bg-white/[0.1]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}

function EditorActions({ onClose, submitLabel }: { onClose: () => void; submitLabel: string }) {
  return (
    <div className="flex justify-end gap-2 border-t border-black/[0.06] pt-5 dark:border-white/[0.07]">
      <button
        type="button"
        onClick={onClose}
        className="h-10 rounded-xl bg-zinc-100 px-4 text-xs font-semibold dark:bg-white/[0.06]"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="flex h-10 items-center gap-2 rounded-xl bg-zinc-950 px-5 text-xs font-semibold text-white dark:bg-amber-300 dark:text-zinc-950"
      >
        <Check className="size-3.5" />
        {submitLabel}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function IconButton({
  label,
  onClick,
  danger = false,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-lg border border-black/[0.06] bg-white text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:border-white/[0.08] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:hover:text-white',
        danger &&
          'hover:border-red-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-300'
      )}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }: { status: PublishStatus }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold capitalize',
        status === 'published'
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
          : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300'
      )}
    >
      <span
        className={cn(
          'size-1.5 rounded-full',
          status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
        )}
      />
      {status}
    </span>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/[0.05]">
        <Search className="size-5 text-zinc-400" />
      </div>
      <p className="mt-4 text-sm font-semibold">{title}</p>
      <p className="mt-2 text-xs text-zinc-400">{description}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 w-56 rounded-lg bg-zinc-200 dark:bg-white/10" />
      <div className="mt-4 h-4 w-96 max-w-full rounded bg-zinc-200 dark:bg-white/10" />
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-40 rounded-[22px] bg-white dark:bg-white/[0.05]" />
        ))}
      </div>
      <div className="mt-4 h-80 rounded-[22px] bg-white dark:bg-white/[0.05]" />
    </div>
  );
}
