import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

const UNWRAP_TYPES = new Set(['OutputBlock', 'Fragment']);

function typeName(type: ReactElement['type']): string {
  if (type === Fragment) return 'Fragment';
  if (typeof type === 'string') return type;
  if (typeof type === 'function') {
    return (type as { displayName?: string; name?: string }).displayName
      || (type as { name?: string }).name
      || '';
  }
  return '';
}

/** Flatten command JSX into sequential blocks for line-by-line reveal. */
export function extractBlocks(node: ReactNode): ReactNode[] {
  if (node == null || typeof node === 'boolean') return [];
  if (typeof node === 'string' || typeof node === 'number') {
    const text = String(node).trim();
    return text ? [node] : [];
  }
  if (Array.isArray(node)) {
    return node.flatMap(extractBlocks);
  }
  if (!isValidElement(node)) return [];

  const name = typeName(node.type);
  const kids = Children.toArray((node.props as { children?: ReactNode }).children);

  if (UNWRAP_TYPES.has(name) || node.type === Fragment) {
    return kids.flatMap(extractBlocks);
  }

  // Unwrap a single layout wrapper div so its children stream individually.
  if (name === 'div' && kids.length > 1) {
    return kids.flatMap(extractBlocks);
  }

  return [node];
}
