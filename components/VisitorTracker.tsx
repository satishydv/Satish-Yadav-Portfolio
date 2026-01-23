'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Track visitor on component mount
    fetch('/api/visitor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((error) => {
      // Fail silently - don't disrupt user experience
      console.debug('Visitor tracking error:', error);
    });
  }, []);

  // This component doesn't render anything
  return null;
}
