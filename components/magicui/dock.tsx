"use client";

import { cn } from "@/lib/utils";
import { motion, type MotionValue, useMotionValue, useSpring, useTransform } from "framer-motion";
import { createContext, useContext, useRef, type ReactNode } from "react";

interface DockProps {
    className?: string;
    children: ReactNode;
    magnification?: number;
    distance?: number;
    baseSize?: number;
    baseIconSize?: number;
}

interface DockIconProps {
    className?: string;
    children?: ReactNode;
}

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 100;
const DEFAULT_BASE_SIZE = 40;
const DEFAULT_BASE_ICON_SIZE = 20;
const ICON_SIZE_RATIO = 0.5;
const SPRING = { mass: 0.1, stiffness: 150, damping: 12 };

interface DockContextValue {
    mouseX: MotionValue<number>;
    magnification: number;
    distance: number;
    baseSize: number;
    baseIconSize: number;
}

const DockContext = createContext<DockContextValue | null>(null);

const Dock = ({
    className,
    children,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    baseSize = DEFAULT_BASE_SIZE,
    baseIconSize = DEFAULT_BASE_ICON_SIZE,
}: DockProps) => {
    const mouseX = useMotionValue(Infinity);

    return (
        <DockContext.Provider value={{ mouseX, magnification, distance, baseSize, baseIconSize }}>
            <motion.div
                onMouseMove={(e) => mouseX.set(e.pageX)}
                onMouseLeave={() => mouseX.set(Infinity)}
                className={cn(
                    "mx-auto w-fit h-full flex items-center justify-center overflow-visible rounded-full border",
                    className
                )}
            >
                {children}
            </motion.div>
        </DockContext.Provider>
    );
};

const DockIcon = ({ className, children }: DockIconProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const context = useContext(DockContext);

    if (!context) {
        throw new Error("DockIcon must be used within a Dock component");
    }

    const { mouseX, magnification, distance, baseSize, baseIconSize } = context;

    const distanceCalc = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const containerSize = useSpring(
        useTransform(distanceCalc, [-distance, 0, distance], [baseSize, magnification || baseSize, baseSize]),
        SPRING
    );
    const iconSize = useSpring(
        useTransform(distanceCalc, [-distance, 0, distance], [
            baseIconSize,
            (magnification || baseSize) * ICON_SIZE_RATIO,
            baseIconSize,
        ]),
        SPRING
    );

    return (
        <motion.div
            ref={ref}
            style={{ width: containerSize, height: containerSize }}
            className={cn(
                "relative flex aspect-square items-center justify-center rounded-full shrink-0",
                className
            )}
        >
            <motion.div
                style={{ width: iconSize, height: iconSize }}
                className="flex items-center justify-center"
            >
                {children}
            </motion.div>
        </motion.div>
    );
};

export { Dock, DockIcon };
export type { DockProps, DockIconProps };
