"use client";

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  useEffect(() => {
    const item = window.localStorage.getItem(key);
    if (item) {
      try {
        const parsed = JSON.parse(item);
        window.requestAnimationFrame(() => {
          setStoredValue(parsed);
        });
      } catch (e) {
        // 文字列データの救済ロジックを維持
        window.requestAnimationFrame(() => {
          setStoredValue(item as unknown as T);
        });
      }
    }
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const nextValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(nextValue));
      return nextValue;
    });
  }, [key]);

  return [storedValue, setValue] as const;
}