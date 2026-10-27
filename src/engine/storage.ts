// localStorage can throw (private mode, blocked storage), so every access is guarded.
export const storage = {
  get<V>(key: string): V | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as V) : null;
    } catch {
      return null;
    }
  },
  set(key: string, value: unknown) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  },
  del(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  },
};
