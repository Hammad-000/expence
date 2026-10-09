import { DollarSign, TrendingUp, PieChart, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../../src/context/ThemeContext';

export const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500';

export const labelClass =
  'mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300';

const features = [
  { icon: <TrendingUp className="h-4 w-4" />, t: 'Real-time balance & insights' },
  { icon: <PieChart className="h-4 w-4" />, t: 'Simple income vs expense tracking' },
  { icon: <ShieldCheck className="h-4 w-4" />, t: 'Private & secured by Firebase' },
];

export default function AuthLayout({
  brandLine1,  brandLine2, brandText, title, subtitle, children,
}) {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-50 transition-colors dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-300/25 blur-3xl dark:bg-fuchsia-600/15" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />
      </div>

      {/* Brand panel (desktop) */}
      <aside className="relative z-10 hidden w-1/2 max-w-xl flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-12 text-white lg:flex">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-500/30">
            <DollarSign className="h-6 w-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight">
            Spend<span className="text-indigo-400">Wise</span>
          </span>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-extrabold leading-tight xl:text-5xl">
            {brandLine1}
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              {brandLine2}
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-slate-300">{brandText}</p>
          <ul className="mt-8 space-y-4">
            {features.map((f) => (
              <li key={f.t} className="flex items-center gap-3 text-sm text-slate-200">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  {f.icon}
                </span>
                {f.t}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} SpendWise. All rights reserved.
        </p>
      </aside>

      {/* Form side */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-16 sm:px-8">
        <ThemeToggle className="absolute right-4 top-4 sm:right-6 sm:top-6" />

        <div className="w-full max-w-md">
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/30">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Spend<span className="text-indigo-600 dark:text-indigo-400">Wise</span>
            </span>
          </div>

          <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-2xl shadow-slate-300/50 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/40 sm:p-8">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                {title}
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}