import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { profile } from '../data/profile';
import { contact } from '../data/contact';

interface IdentityCardProps {
  onRunCommand?: (command: string) => void;
}

const contactLinks = [
  {
    href: `mailto:${contact.email}`,
    label: contact.email,
    icon: Mail,
    external: false,
  },
  {
    href: contact.github,
    label: contact.githubLabel,
    icon: Github,
    external: true,
  },
  {
    href: contact.linkedin,
    label: contact.linkedinLabel,
    icon: Linkedin,
    external: true,
  },
  {
    href: contact.whatsapp,
    label: contact.whatsappLabel,
    icon: Phone,
    external: true,
  },
] as const;

export function IdentityCard({ onRunCommand: _onRunCommand }: IdentityCardProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col">
      <div className="flex h-auto flex-col rounded-md border border-border bg-surface p-5 md:p-6 lg:h-full">
        <div className="mx-auto w-full max-w-[220px] overflow-hidden rounded-md border border-border">
          <img
            src={profile.imageSrc}
            alt={profile.imageAlt}
            className="aspect-square w-full object-cover object-[center_20%]"
            width={220}
            height={220}
          />
        </div>

        <div className="mt-5 space-y-1 text-left">
          <h2 className="font-sans text-xl font-semibold text-primary md:text-2xl">
            {profile.name}
          </h2>
          <p className="font-sans text-sm text-muted">{profile.title}</p>
          <p className="flex items-center gap-1.5 font-sans text-xs text-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {profile.location}
          </p>
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
          {contactLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                title={item.label}
                className="flex min-w-0 items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 font-sans text-[11px] text-muted transition-colors hover:border-border hover:text-primary"
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </div>

        <p className="mt-auto pt-6 text-left font-sans text-sm italic text-muted">
          &ldquo;{profile.quote}&rdquo;
        </p>
      </div>
    </aside>
  );
}
