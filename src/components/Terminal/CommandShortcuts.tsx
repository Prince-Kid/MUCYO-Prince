import { SHORTCUT_COMMANDS } from '../../commands/registry';

interface CommandShortcutsProps {
  onRun: (command: string) => void;
  disabled?: boolean;
}

export function CommandShortcuts({ onRun, disabled }: CommandShortcutsProps) {
  return (
    <div className="border-t border-border px-3 py-2">
      <div className="flex gap-2 overflow-x-auto terminal-scroll pb-1">
        {SHORTCUT_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            disabled={disabled}
            onClick={() => onRun(cmd)}
            className="shrink-0 rounded-sm border border-border bg-bg px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:border-accent/50 disabled:opacity-40"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
