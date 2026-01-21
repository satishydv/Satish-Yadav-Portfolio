'use client';

import React from 'react';
import { Link, Separator, Tooltip } from '@radix-ui/themes';
import {
  GitHubLogoIcon,
  SunIcon,
  MoonIcon,
  FileIcon,
  LinkedInLogoIcon,
  CodeIcon,
  HomeIcon,
} from '@radix-ui/react-icons';
import { usePathname } from 'next/navigation';
import { IoPerson } from 'react-icons/io5';
import type { JSX } from 'react';
import { useDarkmode } from '@/store/useDarkmode';
import { cn } from '@/lib/utils';

const Navbar: React.FC = (): JSX.Element => {
  const { isDarkmode, toggleDarkmode } = useDarkmode();
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 z-50 flex w-full justify-center py-6">
      <div className="flex w-[800px] items-center justify-center rounded-full border border-sky-300/50 bg-sky-400/10 px-2 py-1 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] backdrop-blur-2xl transition-all duration-300 max-[450px]:w-[400px] max-[400px]:w-[345px] max-[350px]:w-[330px] max-[321px]:w-[310px] lg:h-[54px] lg:w-[860px] dark:border-sky-500/30 dark:bg-sky-900/20 dark:shadow-none">
        <div className="flex items-center justify-center gap-8 px-2 transition-all max-[450px]:gap-5 max-[400px]:gap-4 max-sm:gap-4">
          <Link href="/" underline="none">
            <Tooltip content="Home">
              <div className="mt-1 rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <HomeIcon
                  className={cn(
                    'h-[19px] w-[19px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white',
                    pathname == '/' ? '!text-[#cc9e2b] dark:!text-[#FFC83D]' : ''
                  )}
                />
              </div>
            </Tooltip>
          </Link>

          <Link href="/projects">
            <Tooltip content="Projects">
              <div className="rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <CodeIcon
                  className={cn(
                    'h-[19px] w-[19px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white',
                    pathname == '/projects' ? '!text-[#cc9e2b] dark:!text-[#FFC83D]' : ''
                  )}
                />
              </div>
            </Tooltip>
          </Link>


          <Link href="/about">
            <Tooltip content="About">
              <div className="rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <IoPerson
                  className={cn(
                    'h-[18px] w-[18px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white',
                    pathname == '/about' ? '!text-[#cc9e2b] dark:!text-[#FFC83D]' : ''
                  )}
                />
              </div>
            </Tooltip>
          </Link>

          <span className="h-full bg-black dark:bg-gray-400">
            <Separator
              orientation="vertical"
              size={{ sm: '1', lg: '2', xl: '2' }}
              className="bg-black dark:bg-gray-400"
            />
          </span>

          <Link
            href="https://drive.google.com/file/d/1EY671aZ4ZXj3l7rghQiitJACQmF_1xhM/view?usp=sharing"
            target="_blank"
            underline="none"
          >
            <Tooltip content="Resume">
              <div className="rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <FileIcon className="h-[19px] w-[19px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white" />
              </div>
            </Tooltip>
          </Link>

          <Link href="https://github.com/satishydv" target="_blank">
            <Tooltip content="Github">
              <div className="rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <GitHubLogoIcon className="h-[19px] w-[19px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white" />
              </div>
            </Tooltip>
          </Link>


          <Link href="https://www.linkedin.com/in/thesatishydv/" target="_blank">
            <Tooltip content="Linkedin">
              <div className="rounded-full py-2.5 transition-all duration-300 hover:bg-[#F4F4F5] hover:px-3 max-sm:hover:px-2 dark:hover:bg-[#262626]">
                <LinkedInLogoIcon className="h-[19px] w-[19px] text-black max-sm:h-[15px] max-sm:w-[15px] dark:text-white" />
              </div>
            </Tooltip>
          </Link>

          <span className="h-full bg-black dark:bg-gray-400">
            <Separator
              orientation="vertical"
              size={{ sm: '1', lg: '2', xl: '2' }}
              className="bg-black dark:bg-gray-400"
            />
          </span>

          <div
            className="rounded-full py-2.5 transition-all duration-300 hover:px-3 max-sm:hover:px-2"
            onClick={toggleDarkmode}
          >
            <div className="flex items-center">
              <button>
                {isDarkmode == 'dark' ? (
                  <MoonIcon className="h-[18px] w-[18px] cursor-pointer text-white max-sm:h-[14px] max-sm:w-[14px]" />
                ) : (
                  <SunIcon className="h-5 w-5 cursor-pointer max-sm:h-[15px] max-sm:w-[15px]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
