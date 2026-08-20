'use client';

import { cn } from '@/lib/utils';
import {
  motion,
  type HTMLMotionProps,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react';

interface DockProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
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
const SPRING = { mass: 0.18, stiffness: 210, damping: 24, restDelta: 0.01 };

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
  ...props
}: DockProps) => {
  const mouseX = useMotionValue(Infinity);
  const latestPointerX = useRef(Infinity);
  const animationFrame = useRef<number | null>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    latestPointerX.current = event.clientX;

    if (animationFrame.current !== null) return;
    animationFrame.current = window.requestAnimationFrame(() => {
      mouseX.set(latestPointerX.current);
      animationFrame.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (animationFrame.current !== null) {
      window.cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
    latestPointerX.current = Infinity;
    mouseX.set(Infinity);
  };

  useEffect(
    () => () => {
      if (animationFrame.current !== null) window.cancelAnimationFrame(animationFrame.current);
    },
    []
  );

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance, baseSize, baseIconSize }}>
      <motion.div
        {...props}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className={cn(
          'mx-auto flex h-full w-fit items-center justify-center overflow-visible rounded-full border',
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
    throw new Error('DockIcon must be used within a Dock component');
  }

  const { mouseX, magnification, distance, baseSize, baseIconSize } = context;

  const distanceCalc = useTransform(mouseX, (value: number) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return distance;
    return value - bounds.left - bounds.width / 2;
  });

  const containerSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [baseSize, magnification || baseSize, baseSize]
    ),
    SPRING
  );
  const iconSize = useSpring(
    useTransform(
      distanceCalc,
      [-distance, 0, distance],
      [baseIconSize, (magnification || baseSize) * ICON_SIZE_RATIO, baseIconSize]
    ),
    SPRING
  );

  return (
    <motion.div
      ref={ref}
      style={{ width: containerSize, height: containerSize, willChange: 'width, height' }}
      className={cn(
        'relative flex aspect-square shrink-0 items-center justify-center rounded-full',
        className
      )}
    >
      <motion.div
        style={{ width: iconSize, height: iconSize, willChange: 'width, height' }}
        className="flex items-center justify-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export { Dock, DockIcon };
export type { DockProps, DockIconProps };
