import { useCallback, useEffect, useState } from 'react';

/**
 * Reveals `text` one character at a time. Changing `resetKey` restarts the reveal;
 * keeping it the same (e.g. when a choice re-shows the previous line) leaves it as is.
 */
export function useTypewriter(text: string, cps: number, resetKey: string) {
  const [state, setState] = useState({ key: resetKey, n: 0 });
  let n = state.n;
  if (state.key !== resetKey) {
    n = 0;
    setState({ key: resetKey, n: 0 });
  }

  const done = n >= text.length;
  useEffect(() => {
    if (done) return;
    const id = window.setTimeout(() => setState(s => ({ ...s, n: s.n + 1 })), 1000 / cps);
    return () => window.clearTimeout(id);
  }, [n, done, cps]);

  const finish = useCallback(() => setState({ key: resetKey, n: text.length }), [resetKey, text.length]);
  return { shown: text.slice(0, n), done, finish };
}
