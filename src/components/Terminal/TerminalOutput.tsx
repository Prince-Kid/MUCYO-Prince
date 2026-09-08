import React from 'react';

export function TerminalOutput({
  lines,
  visibleCount,
  isStreaming,
}: {
  lines: React.ReactNode[];
  visibleCount: number;
  isStreaming?: boolean;
}) {
  const shown = lines.slice(0, visibleCount);

  if (isStreaming && visibleCount === 0) {
    return (
      <div className="font-mono text-sm text-muted">
        <span className="inline-flex items-center gap-2">
          <span className="terminal-cursor inline-block h-4 w-2 bg-accent align-middle" />
          <span className="text-xs tracking-wide">executing…</span>
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2 font-mono text-sm">
      {shown.map((line, index) => (
        <div key={index} className="animate-line-in">
          {line}
        </div>
      ))}
      {isStreaming && (
        <span className="terminal-cursor inline-block h-4 w-2 bg-accent align-middle" aria-hidden />
      )}
    </div>
  );
}
