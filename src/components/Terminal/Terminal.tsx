import { TerminalOutput } from './TerminalOutput';
import { CommandShortcuts } from './CommandShortcuts';
import { TerminalPromptInput } from './TerminalPromptInput';
import type { useTerminal } from '../../hooks/useTerminal';

type TerminalState = ReturnType<typeof useTerminal>;

export function Terminal(props: TerminalState) {
  const {
    history,
    currentInput,
    setCurrentInput,
    isBusy,
    bootComplete,
    typedBootCommand,
    suggestions,
    suggestionIndex,
    applySuggestion,
    inputRef,
    terminalRef,
    handleKeyDown,
    focusInput,
    runShortcut,
    prompt,
  } = props;

  const showBootTyping = !bootComplete && typedBootCommand.length > 0;

  return (
    <section className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-md border border-border bg-surface">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F56]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#FFBD2E]" aria-hidden />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27C93F]" aria-hidden />
        <span className="ml-2 font-mono text-xs text-muted">mucyo@portfolio: ~</span>
      </div>

      <div
        ref={terminalRef}
        role="log"
        aria-live="polite"
        onClick={focusInput}
        className="terminal-scroll terminal-body min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3 md:px-4"
      >
        <div className="space-y-5 pb-3 font-mono text-sm">
          {history.map((entry) => (
            <div key={entry.id} data-entry-id={entry.id} className="space-y-2">
              {entry.showPrompt !== false && (
                <div className="flex flex-wrap gap-2">
                  <span className="text-accent shrink-0">{prompt}</span>
                  <span className="text-primary">{entry.command}</span>
                </div>
              )}
              <TerminalOutput
                lines={entry.lines}
                visibleCount={entry.visibleCount}
                isStreaming={entry.isStreaming}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-border bg-surface/95 backdrop-blur-sm">
        <div className="space-y-2 px-3 py-3 md:px-4" onClick={focusInput}>
          <div className="flex items-center gap-2 rounded-sm border border-border bg-bg px-3 py-2 font-mono text-sm">
            <span className="text-accent shrink-0">{prompt}</span>
            {showBootTyping ? (
              <span className="text-primary">
                {typedBootCommand}
                <span className="terminal-cursor ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent align-middle" />
              </span>
            ) : (
              <TerminalPromptInput
                value={currentInput}
                disabled={isBusy || !bootComplete}
                placeholder={isBusy ? 'running…' : 'type a command'}
                inputRef={inputRef}
                onChange={setCurrentInput}
                onKeyDown={handleKeyDown}
              />
            )}
          </div>

          {suggestions.length > 0 && !isBusy && bootComplete && (
            <div className="flex flex-wrap gap-2">
              {suggestions.map((cmd, i) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => applySuggestion(cmd)}
                  className={`rounded-sm border px-2 py-0.5 font-mono text-xs transition-colors ${
                    i === suggestionIndex
                      ? 'border-accent text-accent'
                      : 'border-border text-muted hover:border-accent/50 hover:text-primary'
                  }`}
                >
                  {cmd}
                </button>
              ))}
              <span className="self-center text-[10px] text-muted">Tab to complete</span>
            </div>
          )}
        </div>

        <CommandShortcuts onRun={runShortcut} disabled={isBusy || !bootComplete} />
      </div>
    </section>
  );
}
