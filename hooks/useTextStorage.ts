import { useState, useEffect } from 'react';

export function useTextStorage(storageKey: string = 'bangla-voice-text', initialValue: string = '') {
  const [text, setText] = useState(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    const savedText = localStorage.getItem(storageKey);
    if (savedText) {
      setText(savedText);
    }
  }, [storageKey]);

  // Save to localStorage whenever text changes
  useEffect(() => {
    if (isMounted) {
      if (text.trim()) {
        localStorage.setItem(storageKey, text);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [text, storageKey, isMounted]);

  const clearText = () => {
    setText('');
    localStorage.removeItem(storageKey);
  };

  return { text, setText, clearText, isMounted };
}
