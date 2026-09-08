import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent, RefObject } from 'react';

interface TerminalPromptInputProps {
  value: string;
  disabled?: boolean;
  placeholder?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export function TerminalPromptInput({
  value,
  disabled,
  placeholder,
  inputRef,
  onChange,
  onKeyDown,
}: TerminalPromptInputProps) {
  const [caret, setCaret] = useState(0);
  const mirrorRef = useRef<HTMLSpanElement>(null);

  const syncCaret = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    setCaret(el.selectionStart ?? value.length);
  }, [inputRef, value.length]);

  // Keep input active by default whenever it is enabled
  useEffect(() => {
    if (disabled) return;
    const id = window.requestAnimationFrame(() => {
      inputRef.current?.focus();
      syncCaret();
    });
    return () => window.cancelAnimationFrame(id);
  }, [disabled, inputRef, syncCaret]);

  useLayoutEffect(() => {
    syncCaret();
  }, [value, syncCaret]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    const onSelect = () => syncCaret();
    el.addEventListener('select', onSelect);
    el.addEventListener('keyup', onSelect);
    el.addEventListener('click', onSelect);
    el.addEventListener('mouseup', onSelect);

    return () => {
      el.removeEventListener('select', onSelect);
      el.removeEventListener('keyup', onSelect);
      el.removeEventListener('click', onSelect);
      el.removeEventListener('mouseup', onSelect);
    };
  }, [inputRef, syncCaret]);

  const before = value.slice(0, caret);
  const after = value.slice(caret);
  const showPlaceholder = !value && !disabled && Boolean(placeholder);
  const showCaret = !disabled;

  return (
    <div className="relative min-w-[12ch] flex-1 overflow-x-auto font-mono text-sm">
      <div
        className="pointer-events-none flex min-h-[1.25rem] items-center whitespace-pre"
        aria-hidden
      >
        {showPlaceholder ? (
          <>
            {showCaret && (
              <span className="terminal-cursor mr-0.5 inline-block h-4 w-2 shrink-0 bg-accent" />
            )}
            <span className="text-muted/50">{placeholder}</span>
          </>
        ) : (
          <>
            <span ref={mirrorRef} className="text-primary">
              {before}
            </span>
            {showCaret && (
              <span className="terminal-cursor inline-block h-4 w-2 shrink-0 bg-accent" />
            )}
            <span className="text-primary">{after}</span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        disabled={disabled}
        autoFocus
        onChange={(e) => {
          onChange(e.target.value);
          requestAnimationFrame(syncCaret);
        }}
        onKeyDown={(e) => {
          onKeyDown(e);
          requestAnimationFrame(syncCaret);
        }}
        onFocus={() => {
          syncCaret();
        }}
        onBlur={(e) => {
          if (disabled) return;
          const next = e.relatedTarget as HTMLElement | null;
          // Allow focus to move to links/buttons; otherwise keep prompt active
          if (next && (next.tagName === 'A' || next.tagName === 'BUTTON' || next.tagName === 'INPUT')) {
            return;
          }
          window.requestAnimationFrame(() => {
            inputRef.current?.focus();
          });
        }}
        onSelect={syncCaret}
        onClick={syncCaret}
        onKeyUp={syncCaret}
        autoComplete="off"
        spellCheck={false}
        aria-label="Terminal command input"
        aria-autocomplete="list"
        className="terminal-input absolute inset-0 h-full w-full bg-transparent font-mono text-sm text-transparent caret-transparent outline-none disabled:cursor-not-allowed"
      />
    </div>
  );
}
