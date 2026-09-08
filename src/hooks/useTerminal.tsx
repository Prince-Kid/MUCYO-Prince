import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { createCommandRegistry } from '../commands/registry';
import { parseCommand } from '../commands/parseCommand';
import { UnknownOutput } from '../commands/outputs';
import { extractBlocks } from '../commands/extractBlocks';

export interface HistoryEntry {
  id: number;
  command: string;
  lines: ReactNode[];
  visibleCount: number;
  isStreaming?: boolean;
  showPrompt?: boolean;
}

const LINE_DELAY_MS = 70;
const START_DELAY_MS = 280;
const WHOAMI_TYPE_MS = 95;
const BOOT_PAUSE_MS = 450;

export function useTerminal() {
  const registry = useRef(createCommandRegistry()).current;
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [commandIndex, setCommandIndex] = useState(-1);
  const [bootComplete, setBootComplete] = useState(false);
  const [typedBootCommand, setTypedBootCommand] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const streamTimers = useRef<number[]>([]);

  const commandNames = Object.keys(registry).filter((name) => !registry[name].hidden);

  const clearStreamTimers = useCallback(() => {
    streamTimers.current.forEach((t) => window.clearTimeout(t));
    streamTimers.current = [];
  }, []);

  useEffect(() => () => clearStreamTimers(), [clearStreamTimers]);

  const updateSuggestions = useCallback(
    (value: string) => {
      const prefix = value.trim().toLowerCase();
      if (!prefix) {
        setSuggestions([]);
        setSuggestionIndex(0);
        return;
      }
      const matches = commandNames.filter((name) => name.startsWith(prefix) && name !== prefix);
      setSuggestions(matches);
      setSuggestionIndex(0);
    },
    [commandNames]
  );

  const setInputWithSuggestions = useCallback(
    (value: string) => {
      setCurrentInput(value);
      updateSuggestions(value);
    },
    [updateSuggestions]
  );

  const scrollToBottom = useCallback((smooth = true) => {
    requestAnimationFrame(() => {
      const el = terminalRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
    });
  }, []);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const streamBlocks = useCallback(
    (
      id: number,
      blocks: ReactNode[],
      onComplete?: () => void
    ) => {
      clearStreamTimers();
      let visible = 0;

      const tick = () => {
        visible += 1;
        setHistory((prev) =>
          prev.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  visibleCount: visible,
                  isStreaming: visible < blocks.length,
                }
              : entry
          )
        );
        scrollToBottom(false);

        if (visible < blocks.length) {
          const t = window.setTimeout(tick, LINE_DELAY_MS);
          streamTimers.current.push(t);
        } else {
          onComplete?.();
        }
      };

      if (blocks.length === 0) {
        onComplete?.();
        return;
      }

      const start = window.setTimeout(tick, START_DELAY_MS);
      streamTimers.current.push(start);
    },
    [clearStreamTimers, scrollToBottom]
  );

  const runCommand = useCallback(
    (rawInput: string, options?: { animated?: boolean; showPrompt?: boolean }) => {
      const { key, raw } = parseCommand(rawInput);
      if (!key) return;

      const showPrompt = options?.showPrompt !== false;
      const animated = options?.animated !== false;
      const id = ++idRef.current;

      if (key === 'clear') {
        clearStreamTimers();
        setHistory([]);
        setCurrentInput('');
        setCommandIndex(-1);
        setSuggestions([]);
        setIsBusy(false);
        return;
      }

      const cmd = registry[key];
      const output = cmd ? cmd.execute() : <UnknownOutput command={raw || key} />;
      const blocks = extractBlocks(output);

      if (!animated) {
        setHistory((prev) => [
          ...prev,
          {
            id,
            command: raw || key,
            lines: blocks,
            visibleCount: blocks.length,
            showPrompt,
          },
        ]);
        cmd?.sideEffect?.();
        scrollToBottom();
        return;
      }

      setIsBusy(true);
      setHistory((prev) => [
        ...prev,
        {
          id,
          command: raw || key,
          lines: blocks,
          visibleCount: 0,
          isStreaming: true,
          showPrompt,
        },
      ]);
      scrollToBottom(false);

      streamBlocks(id, blocks, () => {
        cmd?.sideEffect?.();
        setIsBusy(false);
        scrollToBottom();
        focusInput();
      });
    },
    [registry, scrollToBottom, focusInput, streamBlocks, clearStreamTimers]
  );

  useEffect(() => {
    let cancelled = false;
    const command = 'whoami';
    let i = 0;

    const interval = window.setInterval(() => {
      if (cancelled) return;
      i += 1;
      setTypedBootCommand(command.slice(0, i));
      if (i >= command.length) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          if (cancelled) return;
          setTypedBootCommand('');
          runCommand(command, { animated: true, showPrompt: true });
          setBootComplete(true);
        }, BOOT_PAUSE_MS);
      }
    }, WHOAMI_TYPE_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [runCommand]);

  useEffect(() => {
    scrollToBottom(false);
  }, [history, scrollToBottom]);

  const handleSubmit = useCallback(() => {
    if (isBusy || !bootComplete) return;
    const value = currentInput.trim();
    if (!value) return;
    setCurrentInput('');
    setCommandIndex(-1);
    setSuggestions([]);
    runCommand(value);
  }, [currentInput, isBusy, bootComplete, runCommand]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (isBusy || !bootComplete) {
        e.preventDefault();
        return;
      }

      const pastCommands = history
        .filter((h) => h.showPrompt !== false && h.command)
        .map((h) => h.command);

      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (suggestions.length > 0) {
          setSuggestionIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
          return;
        }
        if (pastCommands.length === 0) return;
        const next = commandIndex < 0 ? pastCommands.length - 1 : Math.max(0, commandIndex - 1);
        setCommandIndex(next);
        setInputWithSuggestions(pastCommands[next]);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (suggestions.length > 0) {
          setSuggestionIndex((i) => (i + 1) % suggestions.length);
          return;
        }
        if (commandIndex < 0) return;
        const next = commandIndex + 1;
        if (next >= pastCommands.length) {
          setCommandIndex(-1);
          setInputWithSuggestions('');
        } else {
          setCommandIndex(next);
          setInputWithSuggestions(pastCommands[next]);
        }
        return;
      }

      if (e.key === 'Tab' || (e.key === 'ArrowRight' && suggestions.length > 0)) {
        e.preventDefault();
        const prefix = currentInput.trim().toLowerCase();
        if (!prefix && suggestions.length === 0) return;

        const matches =
          suggestions.length > 0
            ? suggestions
            : commandNames.filter((name) => name.startsWith(prefix));

        if (matches.length === 1) {
          setInputWithSuggestions(matches[0]);
          setSuggestions([]);
        } else if (matches.length > 1) {
          if (e.key === 'Tab' && suggestions.length > 0) {
            const pick = matches[suggestionIndex % matches.length];
            setInputWithSuggestions(pick);
            setSuggestions([]);
          } else {
            const common = sharedPrefix(matches);
            if (common.length > prefix.length) {
              setInputWithSuggestions(common);
            }
            setSuggestions(matches);
          }
        }
      }

      if (e.key === 'Escape') {
        setSuggestions([]);
      }
    },
    [
      isBusy,
      bootComplete,
      history,
      commandIndex,
      currentInput,
      commandNames,
      handleSubmit,
      suggestions,
      suggestionIndex,
      setInputWithSuggestions,
    ]
  );

  const applySuggestion = useCallback(
    (cmd: string) => {
      setInputWithSuggestions(cmd);
      setSuggestions([]);
      focusInput();
    },
    [setInputWithSuggestions, focusInput]
  );

  const runShortcut = useCallback(
    (cmd: string) => {
      if (isBusy || !bootComplete) return;
      setInputWithSuggestions('');
      setCommandIndex(-1);
      setSuggestions([]);
      runCommand(cmd);
    },
    [isBusy, bootComplete, runCommand, setInputWithSuggestions]
  );

  return {
    history,
    currentInput,
    setCurrentInput: setInputWithSuggestions,
    isBusy,
    bootComplete,
    typedBootCommand,
    suggestions,
    suggestionIndex,
    applySuggestion,
    inputRef,
    terminalRef,
    handleKeyDown,
    handleSubmit,
    focusInput,
    runShortcut,
    prompt: 'mucyo@portfolio:~$',
  };
}

function sharedPrefix(strings: string[]): string {
  if (strings.length === 0) return '';
  let prefix = strings[0];
  for (let i = 1; i < strings.length; i++) {
    while (!strings[i].startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}
