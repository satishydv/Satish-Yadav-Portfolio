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
    // 1. Try reading from localStorage first if available on client
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
          const parsed = normalizePortfolioContent(JSON.parse(stored));
          // If stored is newer than server-rendered initialContent, prefer stored
          if (
            !initialContent?.updatedAt ||
            (parsed.updatedAt && parsed.updatedAt >= initialContent.updatedAt)
          ) {
            return parsed;
          }
        }
      } catch {}
    }

    if (initialContent) return normalizePortfolioContent(initialContent);
    return cloneDefaults();
  });
  const [isReady, setIsReady] = useState(false);

  // Sync with global server API with timestamp arbitration
  const fetchGlobalContent = useCallback(async () => {
    try {
      const res = await fetch('/api/portfolio-content', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const serverNormalized = normalizePortfolioContent(data);

        setContentState((currentLocal) => {
          const localTimestamp = currentLocal?.updatedAt ?? 0;
          const serverTimestamp = serverNormalized?.updatedAt ?? 0;

          // If local edits are newer than what server returned (e.g. server slow or file read-only),
          // preserve the local changes and re-push them to the server!
          if (localTimestamp > serverTimestamp) {
            fetch('/api/portfolio-content', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(currentLocal),
            }).catch(() => {});
            return currentLocal;
          }

          // Server is newer or equal: adopt server content
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(serverNormalized));
          }
          return serverNormalized;
        });
      }
    } catch (err) {
      console.warn('Could not fetch global portfolio content:', err);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    // Check localStorage on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = window.localStorage.getItem(PORTFOLIO_STORAGE_KEY);
        if (stored) {
          const parsed = normalizePortfolioContent(JSON.parse(stored));
          setContentState((current) => {
            if ((parsed.updatedAt ?? 0) >= (current?.updatedAt ?? 0)) {
              return parsed;
            }
            return current;
          });
        }
      } catch {}
    }

    // Fetch fresh global content from server
    fetchGlobalContent();

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
        const normalized = normalizePortfolioContent({
          ...resolved,
          updatedAt: Date.now(),
        });

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(normalized));
          try {
            window.dispatchEvent(new Event('portfolio-content-update'));
          } catch {}
        }

        // Persist to server globally across all devices & browsers
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
    const defaults = normalizePortfolioContent({
      ...cloneDefaults(),
      updatedAt: Date.now(),
    });

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
          const serverNormalized = normalizePortfolioContent(data);
          setContentState((currentLocal) => {
            const localTimestamp = currentLocal?.updatedAt ?? 0;
            const serverTimestamp = serverNormalized?.updatedAt ?? 0;
            if (localTimestamp > serverTimestamp) return currentLocal;
            window.localStorage.setItem(PORTFOLIO_STORAGE_KEY, JSON.stringify(serverNormalized));
            return serverNormalized;
          });
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
        const normalized = normalizePortfolioContent({
          ...resolved,
          updatedAt: Date.now(),
        });
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
    const defaults = normalizePortfolioContent({
      ...cloneDefaults(),
      updatedAt: Date.now(),
    });
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
