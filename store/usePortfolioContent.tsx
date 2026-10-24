'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  defaultPortfolioContent,
  normalizePortfolioContent,
  PORTFOLIO_STORAGE_KEY,
  type PortfolioContent,
} from '@/lib/portfolio-content';

const cloneDefaults = () =>
  JSON.parse(JSON.stringify(defaultPortfolioContent)) as PortfolioContent;

export type PortfolioContextType = {
  content: PortfolioContent;
  setContent: (
    next: PortfolioContent | ((current: PortfolioContent) => PortfolioContent)
  ) => void;
  resetContent: () => void;
  isReady: boolean;
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({
  children,
  initialContent,
}: {
  children: ReactNode;
  initialContent?: PortfolioContent;
}) {
  const [content, setContentState] = useState<PortfolioContent>(() => {
    if (initialContent) return normalizePortfolioContent(initialContent);
    return cloneDefaults();
  });
  const [isReady, setIsReady] = useState(false);

  // Sync with global server API
  const fetchGlobalContent = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio-content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const normalized = normalizePortfolioContent(data);
        setContentState(normalized);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(normalized));
        }
      }
    } catch (err) {
      console.warn('Could not fetch global portfolio content:', err);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // 1. Initial check: check localStorage first for instant fast-render if available
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
          setContentState(normalizePortfolioContent(JSON.parse(stored)));
        }
      } catch {}
    }

    // 2. Fetch fresh global content from server
    fetchGlobalContent();

    // 3. Listen to local/storage updates
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === PORTFOLIO_STORAGE_KEY) {
        fetchGlobalContent();
      }
    };
    const handleLocalUpdate = () => {
      try {
        const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
          setContentState(normalizePortfolioContent(JSON.parse(stored)));
        }
      } catch {}
    };

    // 4. Also revalidate when tab gains focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchGlobalContent();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('portfolio-content-update', handleLocalUpdate);
    window.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('portfolio-content-update', handleLocalUpdate);
      window.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchGlobalContent]);

  const setContent = useCallback(
    (next: PortfolioContent | ((current: PortfolioContent) => PortfolioContent)) => {
      setContentState((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        const normalized = normalizePortfolioContent(resolved);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(normalized));
          try {
            window.dispatchEvent(new Event('portfolio-content-update'));
          } catch {}
        }

        // Persist to server globally across all devices & browsers!
        fetch('/api/portfolio-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalized),
        }).catch((err) => {
          console.error('Failed to sync portfolio content globally:', err);
        });

        return normalized;
      });
    },
    []
  );

  const resetContent = useCallback(() => {
    const defaults = cloneDefaults();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaults));
      try {
        window.dispatchEvent(new Event('portfolio-content-update'));
      } catch {}
    }
    setContentState(defaults);

    // Persist reset to server globally
    fetch('/api/portfolio-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaults),
    }).catch((err) => {
      console.error('Failed to reset global portfolio content:', err);
    });
  }, []);

  return (
    <PortfolioContext.Provider value={{ content, setContent, resetContent, isReady }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioContent(): PortfolioContextType {
  const context = useContext(PortfolioContext);
  if (context) return context;

  // Standalone fallback if used outside PortfolioProvider
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [content, setContentState] = useState<PortfolioContent>(cloneDefaults);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isReady, setIsReady] = useState(false);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const readStoredContent = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
      setContentState(stored ? normalizePortfolioContent(JSON.parse(stored)) : cloneDefaults());
    } catch {
      setContentState(cloneDefaults());
    }
    setIsReady(true);
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    readStoredContent();

    fetch('/api/portfolio-content', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          const normalized = normalizePortfolioContent(data);
          setContentState(normalized);
          window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(normalized));
        }
      })
      .catch(() => {});

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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const setContent = useCallback(
    (next: PortfolioContent | ((current: PortfolioContent) => PortfolioContent)) => {
      setContentState((current) => {
        const resolved = typeof next === 'function' ? next(current) : next;
        const normalized = normalizePortfolioContent(resolved);
        window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(normalized));
        try {
          window.dispatchEvent(new Event('portfolio-content-update'));
        } catch {}

        fetch('/api/portfolio-content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(normalized),
        }).catch(() => {});

        return normalized;
      });
    },
    []
  );

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const resetContent = useCallback(() => {
    const defaults = cloneDefaults();
    window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(defaults));
    try {
      window.dispatchEvent(new Event('portfolio-content-update'));
    } catch {}
    setContentState(defaults);

    fetch('/api/portfolio-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(defaults),
    }).catch(() => {});
  }, []);

  return { content, setContent, resetContent, isReady };
}
