'use client';

import { FC } from 'react';

interface Btntype {
  prop: string;
  onClick?: () => void;
}
const Button: FC<Btntype> = ({ prop, onClick }) => {
  return (
    <button
      className="group relative h-[34px] w-[110px] origin-left cursor-pointer overflow-hidden rounded-lg bg-neutral-900 text-center text-[10px] font-bold text-white underline underline-offset-2 duration-500 before:absolute before:-right-4 before:-bottom-4 before:z-10 before:h-20 before:w-20 before:rounded-full before:bg-purple-600 before:opacity-40 before:blur-xl before:duration-500 after:absolute after:-top-4 after:right-8 after:z-10 after:h-24 after:w-24 after:rounded-full after:bg-rose-500 after:opacity-30 after:blur-2xl after:duration-500 hover:bg-neutral-800 hover:text-rose-200 hover:underline hover:decoration-2 hover:underline-offset-4 hover:before:right-4 hover:before:bottom-0 hover:before:opacity-80 hover:before:blur-lg hover:after:right-0 hover:after:opacity-60 lg:h-[52px] lg:w-[208px] lg:p-3 lg:text-left lg:text-[15px]"
      onClick={onClick}
    >
      <span className="relative z-20">{prop}</span>
    </button>
  );
};

export default Button;
