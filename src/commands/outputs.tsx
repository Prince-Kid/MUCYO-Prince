import React from 'react';
import {
  profile,
  contact,
  mailtoHref,
  experience,
  education,
  skills,
  leadership,
  certifications,
  projects,
} from '../data';

const muted = 'text-muted';
const accent = 'text-accent';
const link = 'text-link hover:underline';
const primary = 'text-primary';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className={`${accent} font-semibold mb-3`}>{children}</div>;
}

function Line({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`${primary} text-sm leading-relaxed ${className}`}>{children}</div>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <span className={muted}>{children}</span>;
}

function TechPills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2">
      {items.map((item) => (
        <span
          key={item}
          className="border border-border px-2 py-0.5 text-xs text-muted rounded-sm"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function OutputBlock({ children }: { children: React.ReactNode; className?: string }) {
  return <>{children}</>;
}
OutputBlock.displayName = 'OutputBlock';

export function WhoamiOutput() {
  const hintParts = profile.whoamiHint.split(/(help)/);

  return (
    <div className="space-y-1 font-mono text-sm">
      {profile.whoami.map((line) => (
        <Line key={line}>{line}</Line>
      ))}
      <div className={`pt-4 ${primary} text-sm leading-relaxed`}>
        {hintParts.map((part, i) =>
          part === 'help' ? (
            <span key={i} className={accent}>
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
    </div>
  );
}

export function HelpOutput({ entries }: { entries: Array<{ name: string; description: string }> }) {
  const maxLen = Math.max(...entries.map((e) => e.name.length));
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>Available commands</SectionTitle>
      <OutputBlock className="space-y-1">
        {entries.map((entry) => (
          <div key={entry.name} className="flex gap-3">
            <span className={`${accent} shrink-0`} style={{ minWidth: `${maxLen + 1}ch` }}>
              {entry.name}
            </span>
            <span className={muted}>{entry.description}</span>
          </div>
        ))}
      </OutputBlock>
      <div className={`${muted} pt-2 text-xs`}>
        Tip: Tab for autocomplete · ↑/↓ for history · clear to reset
      </div>
    </div>
  );
}

export function AboutOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>about</SectionTitle>
      <Line>
        {profile.name} — {profile.title}
      </Line>
      <Line>
        <Muted>Location:</Muted> {profile.location}
      </Line>
      <div className="space-y-1.5 pt-1">
        {profile.about.map((p) => (
          <Line key={p}>{p}</Line>
        ))}
      </div>
    </div>
  );
}

export function ExperienceOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>experience</SectionTitle>
      <OutputBlock className="space-y-4">
        {experience.map((job) => (
          <div key={`${job.company}-${job.role}`} className="space-y-1">
            <Line>
              <span className={accent}>{job.role}</span>
            </Line>
            <Line>
              <Muted>
                {job.company} · {job.period}
                {job.arrangement ? ` · ${job.arrangement}` : ''}
              </Muted>
            </Line>
            {job.highlights.map((h) => (
              <Line key={h} className="pl-3">
                <Muted>—</Muted> {h}
              </Line>
            ))}
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function ProjectsOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>projects</SectionTitle>
      <OutputBlock className="space-y-5">
        {projects.map((project) => (
          <div key={project.name} className="space-y-1.5 border-t border-border pt-3 first:border-0 first:pt-0">
            <Line>
              <span className={accent}>{project.name}</span>
            </Line>
            <Line>
              <Muted>Role:</Muted> {project.role}
            </Line>
            <Line>
              <Muted>Problem:</Muted> {project.problem}
            </Line>
            <Line>
              <Muted>Architecture:</Muted> {project.architecture}
            </Line>
            <TechPills items={project.stack} />
            <Line className="pt-1">
              <Muted>Status:</Muted>{' '}
              {project.status === 'live' && project.url ? (
                <a href={project.url} target="_blank" rel="noopener noreferrer" className={link}>
                  Live — {project.url.replace(/^https?:\/\//, '')}
                </a>
              ) : (
                <span className={muted}>Internal deployment</span>
              )}
            </Line>
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function SkillsOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>skills</SectionTitle>
      <OutputBlock className="space-y-3">
        {skills.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <Line className={accent}>{cat.name}</Line>
            <TechPills items={cat.items} />
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function EducationOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>education</SectionTitle>
      <OutputBlock className="space-y-4">
        {education.map((ed) => (
          <div key={ed.degree} className="space-y-1">
            <Line>
              <span className={accent}>{ed.degree}</span>
            </Line>
            <Line>
              <Muted>
                {ed.institution}
                {ed.detail ? ` · ${ed.detail}` : ''} · {ed.period}
              </Muted>
            </Line>
            {ed.highlights.map((h) => (
              <Line key={h} className="pl-3">
                <Muted>—</Muted> {h}
              </Line>
            ))}
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function LeadershipOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>leadership</SectionTitle>
      <OutputBlock className="space-y-4">
        {leadership.map((item) => (
          <div key={item.title} className="space-y-1">
            <Line>
              <span className={accent}>{item.title}</span>
            </Line>
            <Line>
              <Muted>
                {item.org}
                {item.period ? ` · ${item.period}` : ''}
              </Muted>
            </Line>
            {item.highlights.map((h) => (
              <Line key={h} className="pl-3">
                <Muted>—</Muted> {h}
              </Line>
            ))}
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function CertificationsOutput() {
  return (
    <div className="font-mono text-sm">
      <SectionTitle>certifications</SectionTitle>
      <OutputBlock className="space-y-4">
        {certifications.map((group) => (
          <div key={group.title} className="space-y-1">
            <Line className={accent}>{group.title}</Line>
            {group.items.map((item) => (
              <Line key={item} className="pl-3">
                <Muted>—</Muted> {item}
              </Line>
            ))}
          </div>
        ))}
      </OutputBlock>
    </div>
  );
}

export function ContactOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>contact</SectionTitle>
      <Line>
        <Muted>Email:</Muted>{' '}
        <a href={`mailto:${contact.email}`} className={link}>
          {contact.email}
        </a>
      </Line>
      <Line>
        <Muted>GitHub:</Muted>{' '}
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className={link}>
          {contact.githubLabel}
        </a>
      </Line>
      <Line>
        <Muted>LinkedIn:</Muted>{' '}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
          {contact.linkedinLabel}
        </a>
      </Line>
      <Line>
        <Muted>WhatsApp:</Muted>{' '}
        <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className={link}>
          {contact.whatsappLabel}
        </a>
      </Line>
      <Line>
        <Muted>Location:</Muted> {contact.location}
      </Line>
    </div>
  );
}

export function ResumeOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>resume</SectionTitle>
      <Line>
        Download / view:{' '}
        <a
          href={contact.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={link}
        >
          MUCYO-Prince-CV.pdf
        </a>
      </Line>
      <Line>
        Also on{' '}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
          LinkedIn
        </a>
        .
      </Line>
    </div>
  );
}

export function GithubOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>github</SectionTitle>
      <Line>
        Opening{' '}
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className={link}>
          {contact.github}
        </a>
      </Line>
    </div>
  );
}

export function LinkedinOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <SectionTitle>linkedin</SectionTitle>
      <Line>
        Opening{' '}
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
          {contact.linkedin}
        </a>
      </Line>
    </div>
  );
}

export function SudoHireOutput() {
  return (
    <div className="space-y-2 font-mono text-sm">
      <Line className={accent}>[sudo] access granted.</Line>
      <Line>Candidate: {profile.name}</Line>
      <Line>Role fit: {profile.title}</Line>
      <Line>Status: open to opportunities</Line>
      <Line className="pt-1">
        Next step:{' '}
        <a
          href={mailtoHref(
            'Hiring inquiry — MUCYO Prince',
            `Hi MUCYO,\n\nI ran sudo hire-mucyo and would like to discuss an opportunity.\n\nBest regards,`
          )}
          className={link}
        >
          email {contact.email}
        </a>
      </Line>
    </div>
  );
}

export function UnknownOutput({ command }: { command: string }) {
  return (
    <div className="space-y-1 font-mono text-sm">
      <Line className="text-red-400">Command not found: {command}</Line>
      <Line>
        <Muted>Type</Muted> <span className={accent}>help</span> <Muted>for available commands.</Muted>
      </Line>
    </div>
  );
}

export function ClearOutput() {
  return null;
}
