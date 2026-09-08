import { contact } from '../data/contact';
import { profile } from '../data/profile';

interface HeaderProps {
  onContact?: () => void;
}

export function Header({ onContact }: HeaderProps) {
  return (
    <header className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border px-4 py-3 md:px-6">
      <div>
        <h1 className="font-sans text-sm font-semibold tracking-wide text-accent md:text-base">
          {profile.displayName}
        </h1>
        <p className="font-sans text-xs text-muted">{profile.shortTitle}</p>
      </div>

      <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-sans">
        <a
          href={contact.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link transition-opacity hover:opacity-80"
        >
          GitHub
        </a>
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link transition-opacity hover:opacity-80"
        >
          LinkedIn
        </a>
        <a
          href={contact.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-link transition-opacity hover:opacity-80"
        >
          Resume
        </a>
        <button
          type="button"
          onClick={onContact}
          className="text-link transition-opacity hover:opacity-80"
        >
          Contact
        </button>
        {profile.available && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            {profile.availabilityLabel}
          </span>
        )}
      </nav>
    </header>
  );
}
