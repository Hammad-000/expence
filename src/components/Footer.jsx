import React from 'react'
import {  DollarSign,  
} from 'lucide-react';

function Footer() {
  return (
       <footer className="relative z-10 border-t border-white/60 bg-white/50 pb-28 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/40 sm:pb-24 lg:pb-0">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-600 to-fuchsia-600">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">
              Spend<span className="text-indigo-600 dark:text-indigo-400">Wise</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track smarter, spend wiser. Built with React &amp; Firebase.
          </p>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            &copy; {new Date().getFullYear()} SpendWise. All rights reserved.
          </p>
        </div>
      </footer>
  )
}

export default Footer