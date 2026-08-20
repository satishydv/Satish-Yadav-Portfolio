'use client';

import { useActionState, useState } from 'react';
import { ArrowRight, Eye, EyeOff, LockKeyhole, Sparkles } from 'lucide-react';
import { loginAdmin, type LoginState } from './actions';
import { Bricolage } from '@/utils/fonts';
import { cn } from '@/lib/utils';
import { useDarkmode } from '@/store/useDarkmode';

const initialState: LoginState = { error: '' };

export default function AdminLogin() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const { isDarkmode, toggleDarkmode } = useDarkmode();

  return (
    <main
      className={cn(
        'relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f3ef] px-5 py-10 text-zinc-950 dark:bg-[#11110f] dark:text-zinc-50',
        Bricolage
      )}
    >
      <div className="pointer-events-none absolute top-[-80px] -left-24 h-80 w-80 rounded-full bg-amber-300/35 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute right-[-40px] -bottom-28 h-96 w-96 rounded-full bg-emerald-300/30 blur-3xl dark:bg-emerald-500/10" />

      <button
        type="button"
        onClick={toggleDarkmode}
        className="absolute top-6 right-6 rounded-full border border-black/8 bg-white/70 px-4 py-2 text-xs font-semibold shadow-sm backdrop-blur transition hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
        aria-label="Toggle color theme"
      >
        {isDarkmode === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>

      <section className="relative grid w-full max-w-[920px] overflow-hidden rounded-[32px] border border-black/8 bg-white shadow-[0_30px_90px_rgba(45,40,25,0.14)] md:grid-cols-[1.05fr_.95fr] dark:border-white/10 dark:bg-[#191916] dark:shadow-black/30">
        <div className="relative hidden min-h-[590px] overflow-hidden bg-[#e9f8d7] p-10 md:flex md:flex-col md:justify-between dark:bg-[#202c1a]">
          <div className="absolute top-28 -right-24 h-64 w-64 rounded-full border-[45px] border-amber-300/80 dark:border-amber-500/50" />
          <div className="absolute bottom-16 left-[-55px] h-44 w-44 rotate-12 rounded-[44px] bg-[#a7ddff] dark:bg-sky-700/60" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-zinc-950 text-sm font-black text-white dark:bg-white dark:text-zinc-950">
              SY
            </div>
            <span className="text-sm font-bold">Satish Portfolio</span>
          </div>
          <div className="relative z-10">
            <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-white/70 shadow-sm dark:bg-white/10">
              <Sparkles className="size-5" />
            </div>
            <h1 className="max-w-sm text-4xl leading-[1.05] font-semibold tracking-[-0.04em]">
              Your work deserves a dashboard that feels just as considered.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-600 dark:text-zinc-300">
              Keep projects, experience, and your profile fresh from one calm workspace.
            </p>
          </div>
        </div>

        <div className="flex min-h-[560px] flex-col justify-center p-7 sm:p-12">
          <div className="mb-8 flex size-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-800 dark:bg-amber-400/10 dark:text-amber-300">
            <LockKeyhole className="size-5" />
          </div>
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-zinc-400 uppercase">
            Admin access
          </p>
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">Welcome back, Satish</h2>
          <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Enter your admin password to manage the portfolio.
          </p>

          <form action={formAction} className="mt-8 space-y-4">
            <label className="block text-sm font-semibold" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-13 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 pr-12 text-sm transition outline-none placeholder:text-zinc-400 focus:border-zinc-500 focus:ring-4 focus:ring-zinc-100 dark:border-white/10 dark:bg-white/5 dark:focus:border-white/30 dark:focus:ring-white/5"
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute top-1/2 right-4 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-zinc-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {state.error && (
              <p
                role="alert"
                className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-2xl bg-zinc-950 px-5 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-amber-300 dark:text-zinc-950 dark:hover:bg-amber-200"
            >
              {isPending ? 'Checking…' : 'Open dashboard'}
              {!isPending && <ArrowRight className="size-4" />}
            </button>
          </form>

          <p className="mt-7 text-center text-xs text-zinc-400">
            Session access expires automatically after 12 hours.
          </p>
        </div>
      </section>
    </main>
  );
}
