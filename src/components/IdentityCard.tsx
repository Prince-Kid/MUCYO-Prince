import { MapPin } from 'lucide-react';
import { profile } from '../data/profile';

const FOCUS_COMMANDS: Record<(typeof profile.focusAreas)[number], string> = {
  Backend: 'skills',
  'Full Stack': 'skills',
  'Web Apps': 'projects',
  'Product Engineering': 'projects',
};

interface IdentityCardProps {
  onRunCommand?: (command: string) => void;
}

export function IdentityCard({ onRunCommand }: IdentityCardProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col">
      <div className="identity-card flex h-auto flex-col rounded-md border border-border bg-surface p-5 md:p-6 lg:h-full">
        <div className="mx-auto w-full max-w-[200px] overflow-hidden rounded-md border border-border md:max-w-[220px]">
          <img
            src={profile.imageSrc}
            alt={profile.imageAlt}
            className="aspect-square w-full object-cover object-top"
            width={220}
            height={220}
          />
        </div>

        <div className="mt-5 space-y-1 text-center md:text-left">
          <h2 className="font-sans text-xl font-semibold text-primary md:text-2xl">
            {profile.name}
          </h2>
          <p className="font-sans text-sm text-muted">{profile.title}</p>
          <p className="flex items-center justify-center gap-1.5 font-sans text-xs text-muted md:justify-start">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {profile.location}
          </p>
        </div>

        <p className="mt-4 font-sans text-sm leading-relaxed text-primary">
          {profile.tagline}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
          {profile.focusAreas.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => onRunCommand?.(FOCUS_COMMANDS[area])}
              className="cursor-pointer rounded-sm border border-border px-2.5 py-1 font-sans text-xs text-muted transition-colors hover:border-accent/40 hover:text-primary"
            >
              {area}
            </button>
          ))}
        </div>

        <p className="mt-6 pt-2 font-sans text-sm italic text-muted lg:mt-auto lg:pt-6">
          &ldquo;{profile.quote}&rdquo;
        </p>
      </div>
    </aside>
  );
}
