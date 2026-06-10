'use client';

import Github from '@/components/Github';
import Footer from '@/components/Footer';
import Introsec from '@/components/Introsec';
import Image from 'next/image';
import Projects from './projects/page';
import Connectwithme from '@/components/Connectwithme';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience/Experience';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';
import useSmoothScroll from '@/components/useSmoothScroll';
import VisitorSection from '@/components/VisitorSection';

export default function Home() {
  useSmoothScroll();
  return (
    <div className="relative isolate overflow-x-hidden bg-neutral-50 dark:bg-neutral-950">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[390px] z-0 hidden h-[360px] sm:block lg:top-[420px]">
        <Image
          src="/assets/homeflwrs/flower-1.webp"
          alt=""
          width={384}
          height={384}
          priority
          className="home-flower home-flower-left absolute left-0 top-8 w-56 opacity-80 lg:w-96"
        />
        <Image
          src="/assets/homeflwrs/flower-2.webp"
          alt=""
          width={500}
          height={500}
          priority
          className="home-flower home-flower-right absolute right-0 top-20 w-60 opacity-80 lg:w-[500px]"
        />
      </div>
      <div className={cn('relative z-10 mx-auto w-full max-w-[900px]', Bricolage)}>
        <Introsec />
        <Projects />
        <Experience />
        <Github />
        <Skills />
        <Connectwithme />
        <VisitorSection />
        <Footer />
      </div>
    </div>
  );
}
