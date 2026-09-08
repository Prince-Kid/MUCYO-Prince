import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';
import { profile } from '../data/profile';

const bibleVerse = {
  text: 'Commit to the Lord whatever you do, and he will establish your plans.',
  reference: 'Proverbs 16:3',
};

function formatLocalDateTime(date: Date) {
  const datePart = new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);

  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);

  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone?.replace(/_/g, ' ') ?? '';

  return { datePart, timePart, timeZone };
}

export function Footer() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const { datePart, timePart, timeZone } = formatLocalDateTime(now);

  return (
    <footer className="flex shrink-0 flex-col gap-2 border-t border-border px-4 py-3 font-sans text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-6">
      <div className="max-w-3xl space-y-1.5">
        <p className="italic leading-relaxed">
          &ldquo;{bibleVerse.text}&rdquo;{' '}
          <span className="not-italic text-muted/80">— {bibleVerse.reference}</span>
        </p>
        <p className="not-italic">
          Inspired by{' '}
          <a
            href="https://gate-re.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-link transition-opacity hover:opacity-80"
          >
            Mark Gatere
          </a>
          , Software Engineer at Microsoft
        </p>
      </div>
      <div className="shrink-0 space-y-1 sm:text-right">
        <p className="inline-flex items-center gap-1.5 sm:justify-end">
          <MapPin className="h-3 w-3 shrink-0" aria-hidden />
          {profile.location}
        </p>
        <p className="tabular-nums text-primary/80">
          {datePart}
          <span className="mx-1.5 text-muted">·</span>
          {timePart}
        </p>
        {timeZone && <p className="text-[10px] text-muted/80">{timeZone}</p>}
      </div>
    </footer>
  );
}
