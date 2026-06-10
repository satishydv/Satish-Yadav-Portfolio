'use client';

import Card from '@/components/project/Card';
import { Bricolage } from '@/utils/fonts';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion } from 'motion/react';
import { projects } from '@/components/project/projects';
import { useState } from 'react';
import { Loadbtn } from '@/components/project/Loadbtn';
import { cn } from '@/lib/utils';
import { Animation, Transition } from '@/lib/animation';
// import { ChevronDownIcon } from '@radix-ui/themes';
// import { ChevronUpIcon } from '@radix-ui/react-icons';

const Projects = () => {
  const pathname = usePathname();

  const [num, setNum] = useState(6);

  return (
    <div className={cn('bg-neutral-50 dark:bg-neutral-950', pathname == '/projects' && 'h-screen')}>
      <motion.div
        {...Animation}
        transition={Transition(0)}
        className={cn(pathname == '/projects' ? 'mb-[30px]' : 'mb-[1px]')}
      >
        <div
          className={cn(
            'flex justify-center bg-neutral-50 px-4 py-2 lg:mb-4 dark:bg-neutral-950',
            pathname == '/projects' ? 'mt-[150px]' : 'mt-[80px]',
            Bricolage
          )}
        >
          <div className="w-[310px] lg:w-[696px]">
            <div className="relative flex h-[60px] w-[210px] items-center pl-[58px]">
              <div
                className="absolute top-1/2 right-0 left-[30px] h-[34px] -translate-y-1/2 bg-[#0800d8]"
                style={{
                  clipPath:
                    'polygon(0 0, calc(100% - 18px) 0, 100% 18%, calc(100% - 10px) 50%, 100% 82%, calc(100% - 18px) 100%, 0 100%)',
                }}
              />
              <div className="absolute left-0 top-1/2 z-10 flex h-[60px] w-[60px] -translate-y-1/2 items-center justify-center rounded-full bg-[#0800d8]">
                <Image
                  src="/projects/flowersml.webp"
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <span className="relative z-10 whitespace-nowrap text-[16px] font-semibold leading-none text-white">
                My latest work
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <div className="mx-auto mb-8 grid justify-center gap-4 lg:grid-cols-2">
            {projects.slice(0, num).map((val, idx) => (
              <Card
                key={idx}
                Title={val.title}
                Desc={val.desc}
                SrcLink={val.srcLink}
                WebLink={val.webLink}
                Skills={val.skills}
                Imglink={val.imgLink}
                color={val.color}
              />
            ))}
          </div>
        </div>

        {/* { projects.length != num ? (
        <div className="flex justify-center lg:mt-[-24px]">
          <Loadbtn name='Load more' onClick={() => setNum(c => c + 2)} icon={<ChevronDownIcon />} />
        </div>
      ) : projects.length == num ? <div className="flex justify-center lg:mt-[-24px]">
        <Loadbtn name='Show less' onClick={() => setNum(c => c > 6 ? c - 2 : c - 0)} icon={<ChevronUpIcon />} /> </div> : <></>
      } */}
      </motion.div>
    </div>
  );
};

export default Projects;
