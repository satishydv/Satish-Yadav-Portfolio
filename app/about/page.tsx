'use client';

import { Bricolage } from '@/utils/fonts';
import { JSX } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Smile, Pin } from 'lucide-react';

const About: React.FC = (): JSX.Element => {
  type AboutType = {
    year: number;
    desc: string[];
    color: string;
    pinColor: string;
    tagColor: string;
    darkGradient: string;
  };

  const aboutArr: Array<AboutType> = [
    {
      year: 2025,
      color: '#FCE7F3', // Pastel Pink
      pinColor: '#F472B6', // Darker Pink
      tagColor: '#FAE8FF', // Lighter Pink/Purple for tag
      darkGradient: 'linear-gradient(135deg, #310D3F 0%, #DB2777 100%)',
      desc: [
        'Got myself enrolled in Summer Internship actuallt 2 internships where i worked with industry folks and learned new stuff',
        `Made an adventure sports travel app which helps folks in hiking, offroading, offboating and many other cool things with features like offline maps, live tracking and many more.`,
      ],
    },
    {
      year: 2024,
      color: '#DBEAFE', // Pastel Blue
      pinColor: '#3B82F6', // Darker Blue
      tagColor: '#EFF6FF', // Lighter Blue for tag
      darkGradient: 'linear-gradient(135deg, #1E1B4B 0%, #2563EB 100%)',
      desc: [

        `Learned React, NodeJs and some DBs like Postgres.
            Made some Projects which gave me a confidence because once you have visual results like "you actually made a website"
            its a very proud feeling.`,
      ],
    },
    {
      year: 2023,
      color: '#FEF9C3', // Pastel Yellow
      pinColor: '#FACC15', // Darker Yellow
      tagColor: '#FFFBEB', // Lighter Yellow for tag
      darkGradient: 'linear-gradient(135deg, #3F2B0D 0%, #D97706 100%)',
      desc: [
        `Joined my Bachelor of Computer Application Degree in Jharkhand Rai University.`,
        `Get myself around technologies and core engineering and The exploration phase started from there `,
      ],
    },
  ];
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pb-20">
      <div className="mx-auto mt-[140px] max-w-[1000px] px-6 relative">
        {/* Connecting Lines (Desktop only) */}
        <div className="absolute top-20 left-1/2 -ml-[1px] h-[calc(100%-200px)] w-[2px] border-l-2 border-dotted border-black/10 hidden md:block" />

        <div className="flex flex-col gap-16 md:gap-24">
          {aboutArr.map((el, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: idx * 0.2 }}
              viewport={{ once: true }}
              className={cn(
                "relative flex w-full",
                idx % 2 === 0 ? "justify-start" : "justify-end"
              )}
            >
              <div
                className="relative w-full max-w-[400px] rounded-[32px] p-6 shadow-xl transition-all hover:scale-[1.02]"
                style={{ backgroundColor: 'white' }}
              >
                {/* Pin Icon */}
                <div className="absolute top-[-20px] left-1/2 -ml-3 z-20">
                  <Pin
                    className="w-10 h-10 drop-shadow-md"
                    fill={el.pinColor}
                    stroke={el.pinColor}
                    style={{ transform: 'rotate(-15deg)' }}
                  />
                </div>

                {/* Card Content with Pastel Background (Light) or Vibrant Gradient (Dark) */}
                <div
                  className="rounded-[24px] p-6 h-full transition-colors duration-500"
                  style={{
                    background: 'var(--card-bg)',
                  } as React.CSSProperties}
                >
                  <style jsx>{`
                    div {
                      --card-bg: ${el.color};
                    }
                    :global(.dark) div {
                      --card-bg: ${el.darkGradient};
                    }
                  `}</style>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-black text-black/50"
                      style={{ backgroundColor: el.tagColor }}
                    >
                      0{idx + 1}
                    </div>
                    <span className={cn("text-2xl font-black tracking-tighter text-black dark:text-white", Bricolage)}>
                      {el.year}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {el.desc.map((d, i) => (
                      <p
                        key={i}
                        className="text-sm md:text-base text-black/80 dark:text-white font-medium leading-relaxed"
                      >
                        {d}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Thanks for Staying Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="mx-auto mt-20 mb-20 flex w-[340px] flex-col items-center justify-center lg:w-[800px]"
      >
        <div className="relative w-full rounded-[60px] bg-[#FFB6F2] py-8 px-8 md:px-12 overflow-visible">
          {/* Scalloped Edges (Top, Bottom, Left, Right) */}
          <div className="absolute top-0 left-0 right-0 -mt-5 h-10 flex space-x-0 overflow-hidden justify-center">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-10 w-10 min-w-[40px] rounded-full bg-[#FFB6F2]" />
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 -mb-5 h-10 flex space-x-0 overflow-hidden justify-center">
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} className="h-10 w-10 min-w-[40px] rounded-full bg-[#FFB6F2]" />
            ))}
          </div>
          <div className="absolute top-0 bottom-0 left-0 -ml-5 w-10 flex flex-col space-y-0 overflow-hidden justify-center">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="h-10 w-10 min-h-[40px] rounded-full bg-[#FFB6F2]" />
            ))}
          </div>
          <div className="absolute top-0 bottom-0 right-0 -mr-5 w-10 flex flex-col space-y-0 overflow-hidden justify-center">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="h-10 w-10 min-h-[40px] rounded-full bg-[#FFB6F2]" />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <h2 className={cn("text-4xl md:text-7xl font-[900] tracking-tighter text-[#1A1A1A] leading-[0.8]", Bricolage)}>
              THANKS FOR
            </h2>

            <div className="flex flex-col items-center justify-center -mt-1 md:-mt-4 gap-3 md:flex-row md:items-end">
              <div className="relative group">
                <div className="relative h-20 w-20 md:h-36 md:w-36 overflow-hidden rounded-[30px] border-[6px] border-[#FFB6F2] shadow-xl rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
                  <Image
                    src="/banner-portrait.png"
                    alt="Portrait"
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-500"
                  />
                </div>
                {/* Smiley face overlay */}
                <div className="absolute -bottom-2 -left-2 z-20 h-10 w-10 md:h-16 md:w-16 rounded-full bg-[#FFD700] p-2 shadow-lg border-2 border-[#1A1A1A] flex items-center justify-center rotate-[10deg]">
                  <Smile className="h-full w-full text-[#1A1A1A] stroke-[2.5]" />
                </div>
              </div>

              <h2 className={cn("text-4xl md:text-7xl font-[900] tracking-tighter text-[#1A1A1A] leading-[0.8]", Bricolage)}>
                STAYING
              </h2>
            </div>

            <div className="mt-6 md:mt-8">
              <p className="max-w-[240px] text-sm md:text-base font-semibold text-[#1A1A1A]/70 leading-tight mx-auto">
                I'm currently open to new projects. DM me please.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
