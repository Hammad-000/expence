// src/components/TransactionForm.jsx
import { useState } from 'react';
import {
  PlusCircle,
  DollarSign,
  FileText,
  Tag,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';

const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Other'],
  expense: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Other'],
};

const labelClass =
  'mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300';

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500';

export default function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const isIncome = type === 'income';

  function handleSubmit(e) {
    e.preventDefault();

    if (!description.trim() || !amount || !category) {
      setError('Please fill in all fields and pick a category.');
      return;
    }

    setError('');
    onAdd({
      description: description.trim(),
      amount: parseFloat(amount),
      type,
      category,
    });

    setDescription('');
    setAmount('');
    setCategory('');
  }

  function switchType(next) {
    setType(next);
    setCategory('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Type selector */}
      <div>
        <label className={labelClass}>Transaction Type</label>
        <div className="grid grid-cols-2 gap-1.5 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => switchType('expense')}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
              !isIncome
                ? 'bg-white text-rose-600 shadow-md dark:bg-slate-700 dark:text-rose-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <TrendingDown className="h-4 w-4" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => switchType('income')}
            className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
              isIncome
                ? 'bg-white text-emerald-600 shadow-md dark:bg-slate-700 dark:text-emerald-300'
                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Income
          </button>
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className={labelClass}>Description</label>
        <div className="relative">
          <FileText className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Lunch at cafe"
            className={inputClass}
            required
          />
        </div>
      </div>

      {/* Amount */}
      <div>
        <label htmlFor="amount" className={labelClass}>Amount</label>
        <div className="relative">
          <DollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            inputMode="decimal"
            className={`${inputClass} pr-14`}
            required
          />
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            USD
          </span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>
          <Tag className="h-4 w-4" />
          Category
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {categories[type].map((cat) => {
            const active = category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setCategory(cat);
                  setError('');
                }}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                  active
                    ? isIncome
                      ? 'border-emerald-500 bg-emerald-50 font-semibold text-emerald-700 dark:border-emerald-400 dark:bg-emerald-500/15 dark:text-emerald-300'
                      : 'border-rose-500 bg-rose-50 font-semibold text-rose-700 dark:border-rose-400 dark:bg-rose-500/15 dark:text-rose-300'
                    : 'border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-500'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 ${
          isIncome
            ? 'bg-gradient-to-r from-emerald-500 to-teal-600 shadow-emerald-500/30 focus:ring-emerald-500/30'
            : 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-rose-500/30 focus:ring-rose-500/30'
        }`}
      >
        <PlusCircle className="h-5 w-5" />
        Add {isIncome ? 'Income' : 'Expense'}
      </button>

      {/* Quick summary */}
      <div className="space-y-1 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        <div className="flex justify-between">
          <span>Selected type</span>
          <span className={`font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {isIncome ? 'Income' : 'Expense'}
          </span>
        </div>
        {amount && (
          <div className="flex justify-between">
            <span>Amount</span>
            <span className={`font-semibold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              ${parseFloat(amount || 0).toFixed(2)}
            </span>
          </div>
        )}
      </div>
    </form>
  );
}