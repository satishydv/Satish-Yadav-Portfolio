'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
  PORTFOLIO_STORAGE_KEY,
  type PortfolioContent,
} from '@/lib/portfolio-content';

const cloneDefaults = () => JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent;

export function usePortfolioContent() {
  const [content, setContentState] = useState<PortfolioContent>(cloneDefaults);
  const [isReady, setIsReady] = useState(false);

  const readStoredContent = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      setContentState(stored ? normalizePortfolioContent(JSON.parse(stored)) : cloneDefaults());
    } catch {
      setContentState(cloneDefaults());
    }
    setIsReady(true);
  }, []);

  useEffect(() => {
    readStoredContent();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === PORTFOLIO_STORAGE_KEY) readStoredContent();
    };
    const handleLocalUpdate = () => readStoredContent();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('portfolio-content-update', handleLocalUpdate);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('portfolio-content-update', handleLocalUpdate);
    };
  }, [readStoredContent]);

  const setContent = useCallback(
    (next: PortfolioContent | ((current: PortfolioContent) => PortfolioContent)) => {
      setContentState((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(resolved));
        try {
          window.dispatchEvent(new Event('portfolio-content-update'));
        } catch {}
        return resolved;
      });
    },
    []
  );

  const resetContent = useCallback(() => {
    const defaults = cloneDefaults();
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaults));
    try {
      window.dispatchEvent(new Event('portfolio-content-update'));
    } catch {}
    setContentState(defaults);
  }, []);

  return { content, setContent, resetContent, isReady };
}
