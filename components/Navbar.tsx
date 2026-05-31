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
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
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
          baseSize={!isMounted ? 40 : (isMobile ? 32 : 40)}
          baseIconSize={!isMounted ? 20 : (isMobile ? 18 : 20)}
          magnification={!isMounted ? 60 : (isMobile ? 0 : 60)}
          style={{
            backdropFilter: "brightness(1.15) blur(2px) saturate(140%) url(#dockDisplacement)",
            WebkitBackdropFilter: "brightness(1.15) blur(2px) saturate(140%) url(#dockDisplacement)",
          }}
          className={cn(
            "!w-fit !h-14 !mx-auto items-center transition-all duration-300",
            "relative overflow-hidden rounded-full border border-white/30 bg-white/15 backdrop-blur-sm",
            "shadow-[0_16px_40px_rgba(0,0,0,0.35),inset_0_1px_0px_rgba(255,255,255,0.85),inset_0_-1px_0px_rgba(255,255,255,0.2)]",
            "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/85 before:via-transparent before:to-transparent before:opacity-80 before:pointer-events-none",
            "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/45 after:via-transparent after:to-transparent after:opacity-60 after:pointer-events-none",
            "dark:border-white/20 dark:bg-white/10 dark:shadow-[0_20px_48px_rgba(0,0,0,0.55),inset_0_1px_0px_rgba(255,255,255,0.45),inset_0_-1px_0px_rgba(255,255,255,0.15)]",
            (!isMounted || !isMobile) ? "px-3 gap-2" : "px-2 gap-1.5"
          )}
        >
          {navItems.map((item) => (
            <Tooltip key={item.href} content={item.label}>
              <Link href={item.href} underline="none" className="flex items-center">
                <DockIcon className={cn(
                  "relative overflow-hidden rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-all",
                  "shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_6px_14px_rgba(0,0,0,0.18)]",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
                  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
                  "hover:bg-white/25",
                  "dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/15"
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

          <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-white/40 dark:bg-white/20" />

          {socialItems.map((item) => (
            <Tooltip key={item.href} content={item.label}>
              <Link href={item.href} target="_blank" underline="none" className="flex items-center">
                <DockIcon className={cn(
                  "relative overflow-hidden rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-all",
                  "shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_6px_14px_rgba(0,0,0,0.18)]",
                  "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
                  "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
                  "hover:bg-white/25",
                  "dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/15"
                )}>
                  <item.icon className="size-full text-black dark:text-white" />
                </DockIcon>
              </Link>
            </Tooltip>
          ))}

          <Separator orientation="vertical" className="h-2/3 m-auto w-px bg-white/40 dark:bg-white/20" />

          <Tooltip content="Theme">
            <button onClick={toggleDarkmode} className="outline-none flex items-center">
              <DockIcon className={cn(
                "relative overflow-hidden rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-all",
                "shadow-[inset_0_1px_0px_rgba(255,255,255,0.7),0_6px_14px_rgba(0,0,0,0.18)]",
                "before:content-[''] before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-br before:from-white/60 before:via-transparent before:to-transparent before:opacity-70 before:pointer-events-none",
                "after:content-[''] after:absolute after:inset-0 after:rounded-full after:bg-gradient-to-tl after:from-white/30 after:via-transparent after:to-transparent after:opacity-50 after:pointer-events-none",
                "hover:bg-white/25",
                "dark:border-white/15 dark:bg-white/5 dark:hover:bg-white/15"
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
        <svg aria-hidden="true" className="absolute h-0 w-0">
          <filter id="dockDisplacement">
            <feTurbulence
              type="turbulence"
              baseFrequency="0.004"
              numOctaves="2"
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
    </nav>
  );
};


export default Navbar;
