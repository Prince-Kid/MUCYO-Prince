export interface ParsedCommand {
  raw: string;
  key: string;
  args: string[];
}

/** Normalize input and support multi-word eggs like `sudo hire-mucyo`. */
export function parseCommand(input: string): ParsedCommand {
  const raw = input.trim();
  const normalized = raw.toLowerCase().replace(/\s+/g, ' ');

  if (!normalized) {
    return { raw, key: '', args: [] };
  }

  if (normalized === 'sudo hire-mucyo' || normalized.startsWith('sudo hire-mucyo ')) {
    return { raw, key: 'sudo hire-mucyo', args: [] };
  }

  const parts = normalized.split(' ');
  return {
    raw,
    key: parts[0],
    args: parts.slice(1),
  };
}
