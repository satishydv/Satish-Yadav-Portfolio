import Link from 'next/link';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <div
      className={cn(
        'mb-1 flex h-10 items-center justify-center bg-transparent text-[12px] text-neutral-600 lg:text-[16px] dark:text-neutral-400',
        Bricolage
      )}
    >
      Designed and Developed by
      <Link
        className="ml-1.5 rounded-sm bg-[#E0F2FE] px-[6px] py-[1px] font-medium text-[#0369a1] transition-transform hover:scale-110 lg:px-2 lg:py-0.5 dark:bg-[#0369a1]/20 dark:text-[#E0F2FE]"
        href="https://x.com/abdullah_twt23"
        target="_black"
      >
        Satish Yadav
      </Link>
    </div>
  );
};

export default Footer;
