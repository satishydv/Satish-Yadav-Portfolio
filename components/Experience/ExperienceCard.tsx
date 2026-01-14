'use client';
import Image from 'next/image';
import { MagicCard } from '../magicui/magic-card';
import { Link } from '@radix-ui/themes';
import { Bricolage } from '@/utils/fonts';
import { useDarkmode } from '@/store/useDarkmode';
import experience from './ExperienceData';
import { ExpTypes } from '@/types/components/experience-types';

const Experience = () => {
  const { isDarkmode } = useDarkmode();
  return (
    <div className="mx-auto mt-4 flex w-[750px] flex-col items-center pb-8 max-lg:w-full max-lg:px-20 max-sm:w-full max-sm:px-5">
      {experience.map((exp: ExpTypes) => (
        <MagicCard
          key={exp.org}
          className="h-fit cursor-pointer border-none !bg-transparent dark:shadow-2xl"
          gradientColor={`${isDarkmode === 'dark' ? '#262626' : 'oklch(95.6% 0.045 203.388)'}`}
        >
          <div
            className={`${exp.role === 'Freelance' ? 'max-lg:ml-1 max-sm:ml-1' : ''} flex w-full px-5 py-3 max-sm:px-0 max-sm:pr-1`}
          >
            <div
              className={`flex w-24 items-center justify-center max-sm:justify-start ${exp.logo === '/freelance-icon.webp' ? 'max-sm:!w-[79px]' : ''} ${exp.logo === '/stealth-startup.jpeg' ? 'max-sm:!w-[92px]' : ''}`}
            >
              <Link href={exp.link} target="_blank">
                <Image
                  src={exp.logo}
                  alt="company-logo"
                  width={50}
                  height={50}
                  className={`rounded-full`}
                />
              </Link>
            </div>
            <div className="w-full text-start">
              <div className={`${exp.role === 'Freelance' ? 'max-lg:ml-2 max-sm:ml-2' : ''}`}>
                <div
                  className={`flex w-[41vw] !justify-between max-lg:w-full max-sm:w-full max-sm:items-center ${Bricolage}`}
                >
                  <div className="mb-1 text-lg !leading-4 font-semibold max-sm:text-base">
                    {exp.role}
                  </div>
                  <div className={`text-xs max-sm:hidden max-sm:text-[10px]`}>{exp.duration}</div>
                </div>
                <h2 className={`text-sm max-sm:text-xs ${Bricolage}`}>{exp.org}</h2>
                <h2 className={`mt-1 hidden text-sm max-sm:block max-sm:text-[10px] ${Bricolage}`}>
                  {exp.duration}
                </h2>
                <ul className="mt-4 list-none pl-0 text-xs text-neutral-600 dark:text-neutral-400 flex flex-col justify-center gap-0">
                  {exp.desc && exp.desc.map((bullet, i) => (
                    <li key={i} className="flex flex-row items-stretch">
                      {/* Bracket Slice */}
                      <div className="relative w-12 flex-shrink-0 flex items-center justify-center overflow-visible">
                        <svg
                          viewBox="0 0 40 40"
                          preserveAspectRatio="none"
                          className="h-full w-full overflow-visible"
                          style={{ filter: 'drop-shadow(0 0 4px rgba(234, 255, 0, 0.8))' }}
                        >
                          {/* Vertical Section */}
                          <path
                            d={
                              i === 0
                                ? "M 40 0 C 20 0, 10 5, 10 20 L 10 40"
                                : i === (exp.desc?.length ?? 0) - 1
                                  ? "M 10 0 L 10 20 C 10 35, 20 40, 40 40"
                                  : "M 10 0 L 10 40"
                            }
                            fill="none"
                            stroke="#EAFF00"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />
                          {/* Horizontal Arm */}
                          <path
                            d="M 10 20 L 40 20"
                            fill="none"
                            stroke="#EAFF00"
                            strokeWidth="2.5"
                            strokeDasharray="4 4"
                          />
                        </svg>
                      </div>

                      {/* Content Section */}
                      <div className="flex flex-row items-center py-2 h-full">
                        <span className="mr-3 h-2 w-2 shrink-0 rounded-full bg-[#EAFF00] shadow-[0_0_12px_rgba(234,255,0,1)]" />
                        <span className="leading-relaxed text-sm md:text-base">{bullet}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
};

export default Experience;
