'use client';

import { JSX, FC } from 'react';
import Button from '../components/Button';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Animation, Transition } from '@/lib/animation';

const Introsec: FC = (): JSX.Element => {

  const scrollDown = () => {
    const scrollTarget = window.innerWidth > 1500 ? 5000 : 6000;
    window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
  };

  return (
    <div className="mt-[120px] flex flex-col items-center justify-center bg-neutral-50 text-neutral-900 lg:mt-26 lg:h-[500px] dark:bg-neutral-950 dark:text-white/90">
      <motion.div
        {...Animation}
        transition={Transition(0.6)}
        className="relative flex h-[70px] w-[95px] justify-center lg:h-[110px] lg:w-[140px]"
      >
        <Image
          alt="me"
          src="/me.webp"
          onClick={() => window.open('https://github.com/satishydv', '_blank')}
          fill
          className="rounded-lg object-cover"
          priority
        />
      </motion.div>

      <motion.div
        {...Animation}
        transition={Transition(0.8)}
        className="p-4 pb-1 text-[26px] font-bold lg:text-[42px]"
      >
        Hey, I&apos;m{' '}
        <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent dark:from-cyan-300 dark:to-emerald-300">
          Satish Yadav
        </span>
      </motion.div>

      <motion.div
        {...Animation}
        transition={Transition(1.15)}
        className="px-4 pt-1 text-center text-[13px] lg:text-[16px]"
      >
        Hey folks I am Satish, a Software Engineer hooked on crafting products using Typescript
        and Go.
      </motion.div>

      <motion.div
        {...Animation}
        transition={Transition(1.25)}
        className="px-4 pt-1 text-center text-[13px] lg:text-[16px]"
      >
        I have expertise in wide range of tech but always want to be known as a student of Computer
        science.
      </motion.div>

      <motion.div
        {...Animation}
        transition={Transition(1.35)}
        className="px-4 pt-1 text-center text-[13px] lg:text-[16px]"
      >
        Want&apos;s to connect, share thoughts or just say hello? please don&apos;t hesitate. feel
        free to connect!
      </motion.div>

      <motion.div
        {...Animation}
        transition={Transition(1.45)}
        className="mt-[30px] flex space-x-4 lg:mt-[40px] lg:space-x-6"
      >
        <Button prop="Book a Meet" />
        <Button prop="Get in Touch" onClick={scrollDown} />
      </motion.div>
    </div>
  );
};

export default Introsec;
