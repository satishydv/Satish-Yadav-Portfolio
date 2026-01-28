'use client';

import React from 'react';
import { Link, Separator, Tooltip } from '@radix-ui/themes';
import {
  Home,
  FolderCode,
  User,
  FileText,
  Github,
  Linkedin,
  Sun,
  Moon,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { JSX } from 'react';
import { useDarkmode } from '@/store/useDarkmode';
import { cn } from '@/lib/utils';
import { Dock, DockIcon } from '@/components/magicui/dock';

const Navbar: React.FC = (): JSX.Element => {
  const { isDarkmode, toggleDarkmode } = useDarkmode();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const navItems = [
    { href: '/', label: 'Home', icon: Home, type: 'internal' },
    { href: '/projects', label: 'Projects', icon: FolderCode, type: 'internal' },
    { href: '/about', label: 'About', icon: User, type: 'internal' },
  ];

  const socialItems = [
    {
      href: 'https://drive.google.com/file/d/1j9BOkVSlWk-_Axayj705fv7kHZp9mzFW/view?usp=sharing',
      label: 'Resume',
      icon: FileText,
    },
    { href: 'https://github.com/satishydv', label: 'Github', icon: Github },
    {
      href: 'https://www.linkedin.com/in/thesatishydv/',
      label: 'Linkedin',
      icon: Linkedin,
    },
  ];

  return (
    <nav className="fixed top-6 z-50 flex w-full justify-center pointer-events-none">
      <div className="pointer-events-auto">
        <Dock
          baseSize={isMobile ? 32 : 40}
          baseIconSize={isMobile ? 18 : 20}
          magnification={isMobile ? 0 : 60}
          className={cn(
            "!w-fit !h-14 !mx-auto bg-sky-400/10 border-sky-300/50 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] dark:bg-sky-900/20 dark:border-sky-500/30 dark:shadow-none items-center transition-all duration-300",
            isMobile ? "px-2 gap-1.5" : "px-3 gap-2"
          )}
        >
          {navItems.map((item) => (
            <Tooltip key={item.href} content={item.label}>
              <Link href={item.href} underline="none" className="flex items-center">
                <DockIcon className={cn(
                  "bg-sky-400/5 border border-sky-300/30 backdrop-blur-md dark:bg-sky-900/10 dark:border-sky-500/20 transition-all",
                  "hover:bg-sky-400/20 dark:hover:bg-sky-900/40"
                )}>
                  <item.icon
                    className={cn(
                      'size-full transition-colors',
                      pathname === item.href ? 'text-[#cc9e2b] dark:text-[#FFC83D]' : 'text-black dark:text-white'
                    )}
                  />
                </DockIcon>
              </Link>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-sky-300/50 dark:bg-sky-500/30" />

          {socialItems.map((item) => (
            <Tooltip key={item.href} content={item.label}>
              <Link href={item.href} target="_blank" underline="none" className="flex items-center">
                <DockIcon className={cn(
                  "bg-sky-400/5 border border-sky-300/30 backdrop-blur-md dark:bg-sky-900/10 dark:border-sky-500/20 transition-all",
                  "hover:bg-sky-400/20 dark:hover:bg-sky-900/40"
                )}>
                  <item.icon className="size-full text-black dark:text-white" />
                </DockIcon>
              </Link>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-sky-300/50 dark:bg-sky-500/30" />

          <Tooltip content="Theme">
            <button onClick={toggleDarkmode} className="outline-none flex items-center">
              <DockIcon className={cn(
                "bg-sky-400/5 border border-sky-300/30 backdrop-blur-md dark:bg-sky-900/10 dark:border-sky-500/20 transition-all",
                "hover:bg-sky-400/20 dark:hover:bg-sky-900/40"
              )}>
                {isDarkmode === 'dark' ? (
                  <Moon className="size-full text-white" />
                ) : (
                  <Sun className="size-full text-black" />
                )}
              </DockIcon>
            </button>
          </Tooltip>
        </Dock>
      </div>
    </nav>
  );
};


export default Navbar;
