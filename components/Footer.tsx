import Link from 'next/link';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';
import { FlickeringGrid } from './magicui/flickering-grid';

const Footer = () => {
  return (
    <div className="relative w-full h-24 mt-10 overflow-hidden">
      <div className="absolute inset-0 z-0" style={{ maskImage: 'radial-gradient(circle, black, transparent)', WebkitMaskImage: 'radial-gradient(circle, black, transparent)' }}>
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={2}
          color="#22d3ee"
          maxOpacity={0.4}
          flickerChance={0.3}
        />
      </div>
      <div
        className={cn(
          'relative z-10 flex h-full items-center justify-center bg-transparent text-[12px] text-neutral-600 lg:text-[16px] dark:text-neutral-400',
          Bricolage
        )}
      >
        Designed and Developed by
        <Link
          className="ml-1.5 rounded-sm bg-[#E0F2FE] px-[6px] py-[1px] font-medium text-[#0369a1] transition-transform hover:scale-110 lg:px-2 lg:py-0.5 dark:bg-[#0369a1]/20 dark:text-[#E0F2FE]"
          href="https://x.com/thesatishydv2"
          target="_black"
        >
          Satish Yadav
        </Link>
      </div>
    </div>
  );
};

export default Footer;
