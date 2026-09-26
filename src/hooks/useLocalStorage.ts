import { useEffect, useState } from 'react';
export function useLocalStorage<T>(key: string, decode: (raw: string | null) => T) {
  const [warning, setWarning] = useState('');
  const [value, setValue] = useState<T>(() => {
    try { return decode(window.localStorage.getItem(key)); }
    catch { return decode(null); }
  });
  useEffect(() => {
    try { window.localStorage.setItem(key, JSON.stringify(value)); setWarning(''); }
    catch { setWarning('Browser storage is unavailable. Your changes will last only for this session.'); }
  }, [key, value]);
  return { value, setValue, warning };
}
