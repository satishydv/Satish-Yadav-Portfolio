'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Animation, Transition } from '@/lib/animation';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';
import { Quote, Users } from 'lucide-react';

const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
};

export default function VisitorSection() {
    const [stats, setStats] = useState<{ today: number; allTime: number } | null>(null);

    useEffect(() => {
        fetch('/api/visitor')
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    setStats(data.stats);
                }
            })
            .catch((err) => console.error('Error fetching visitor stats:', err));
    }, []);

    return (
        <motion.div
            {...Animation}
            transition={Transition(0.3)}
            className={cn(
                'relative mx-auto mb-[40px] flex w-[335px] flex-col overflow-hidden rounded-[2rem] border border-amber-200 bg-amber-100/80 p-6 lg:mb-[60px] lg:w-[760px] lg:flex-row lg:items-center lg:justify-between dark:border-amber-900/30 dark:bg-amber-950/20',
                Bricolage
            )}
        >
            {/* Background Icon */}
            <Users className="absolute -right-4 -top-8 size-48 rotate-12 text-amber-500/10 dark:text-amber-500/5" />

            {/* Quote Section */}
            <div className="relative z-10 flex flex-1 items-start gap-3 lg:pr-8">
                <Quote className="mt-1 size-5 shrink-0 text-amber-600/40 rotate-180" />
                <div>
                    <p className="text-[14px] font-medium leading-relaxed text-amber-900 dark:text-amber-100 lg:text-[16px]">
                        Simplicity is the ultimate sophistication. True mastery lies in making the complex feel
                        effortless.
                    </p>
                    <p className="mt-2 text-[12px] font-bold text-amber-700/80 dark:text-amber-400 lg:text-[14px]">
                        — Leonardo da Vinci
                    </p>
                </div>
            </div>

            {/* Divider for mobile */}
            <div className="relative z-10 my-4 h-px w-full bg-amber-200 lg:hidden dark:bg-amber-900/30" />

            {/* Divider for desktop */}
            <div className="relative z-10 hidden h-12 w-px bg-amber-200 lg:block dark:bg-amber-900/30" />

            {/* Visitor Count Section */}
            <div className="relative z-10 flex flex-col items-center justify-center lg:pl-8">
                <div className="text-center">
                    <span className="text-[14px] font-medium text-amber-800 dark:text-amber-300 lg:text-[15px]">
                        You are
                    </span>
                    <span className="mx-1.5 text-[20px] font-black text-amber-600 dark:text-amber-400 lg:text-[28px]">
                        {stats ? (
                            <>
                                {stats.allTime.toLocaleString()}
                                <sup className="text-[12px] font-bold lg:text-[16px]">
                                    {getOrdinalSuffix(stats.allTime)}
                                </sup>
                            </>
                        ) : (
                            '...'
                        )}
                    </span>
                    <span className="text-[14px] font-medium text-amber-800 dark:text-amber-300 lg:text-[15px]">
                        visitor
                    </span>
                </div>
            </div>
        </motion.div>
    );
}
