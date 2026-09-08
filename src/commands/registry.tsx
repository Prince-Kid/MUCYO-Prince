import React from 'react';
import { contact } from '../data';
import {
  AboutOutput,
  CertificationsOutput,
  ClearOutput,
  ContactOutput,
  EducationOutput,
  ExperienceOutput,
  GithubOutput,
  HelpOutput,
  LeadershipOutput,
  LinkedinOutput,
  ProjectsOutput,
  ResumeOutput,
  SkillsOutput,
  SudoHireOutput,
  WhoamiOutput,
} from './outputs';

export interface CommandDefinition {
  name: string;
  description: string;
  /** When true, command is hidden from help but still executable. */
  hidden?: boolean;
  execute: () => React.ReactNode;
  /** Side effect after execute (e.g. open URL). */
  sideEffect?: () => void;
}

const openExternal = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};

function buildHelpEntries(registry: Record<string, CommandDefinition>) {
  return Object.values(registry)
    .filter((cmd) => !cmd.hidden)
    .map(({ name, description }) => ({ name, description }));
}

export function createCommandRegistry(): Record<string, CommandDefinition> {
  const registry: Record<string, CommandDefinition> = {
    help: {
      name: 'help',
      description: 'List available commands',
      execute: () => <HelpOutput entries={buildHelpEntries(registry)} />,
    },
    whoami: {
      name: 'whoami',
      description: 'Professional introduction',
      execute: () => <WhoamiOutput />,
    },
    about: {
      name: 'about',
      description: 'Learn about MUCYO Prince',
      execute: () => <AboutOutput />,
    },
    experience: {
      name: 'experience',
      description: 'Work experience',
      execute: () => <ExperienceOutput />,
    },
    projects: {
      name: 'projects',
      description: 'Engineering case studies',
      execute: () => <ProjectsOutput />,
    },
    skills: {
      name: 'skills',
      description: 'Technical skills',
      execute: () => <SkillsOutput />,
    },
    education: {
      name: 'education',
      description: 'Educational background',
      execute: () => <EducationOutput />,
    },
    leadership: {
      name: 'leadership',
      description: 'Leadership and recognition',
      execute: () => <LeadershipOutput />,
    },
    certifications: {
      name: 'certifications',
      description: 'Certifications and learning',
      execute: () => <CertificationsOutput />,
    },
    contact: {
      name: 'contact',
      description: 'Contact information',
      execute: () => <ContactOutput />,
    },
    resume: {
      name: 'resume',
      description: 'Download / view resume',
      execute: () => <ResumeOutput />,
      sideEffect: () => openExternal(contact.resumeUrl),
    },
    github: {
      name: 'github',
      description: 'Open GitHub profile',
      execute: () => <GithubOutput />,
      sideEffect: () => openExternal(contact.github),
    },
    linkedin: {
      name: 'linkedin',
      description: 'Open LinkedIn profile',
      execute: () => <LinkedinOutput />,
      sideEffect: () => openExternal(contact.linkedin),
    },
    clear: {
      name: 'clear',
      description: 'Clear the terminal',
      execute: () => <ClearOutput />,
    },
    'sudo hire-mucyo': {
      name: 'sudo hire-mucyo',
      description: 'Easter egg — hire path',
      hidden: true,
      execute: () => <SudoHireOutput />,
    },
  };

  return registry;
}

export const SHORTCUT_COMMANDS = [
  'help',
  'about',
  'projects',
  'skills',
  'experience',
  'contact',
  'resume',
] as const;
