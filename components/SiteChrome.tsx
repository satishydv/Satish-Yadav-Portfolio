'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import VisitorTracker from '@/components/VisitorTracker';

export default function SiteChrome() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <VisitorTracker />
      <Navbar />
    </>
  );
}
