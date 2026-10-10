// src/components/TransactionList.jsx
import { useMemo, useState } from 'react';
import {
  Trash2,
  Calendar,
  Search,
  X,
  Check,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  Briefcase,
  Laptop,
  TrendingUp,
  MoreHorizontal,
} from 'lucide-react';

const PAGE_SIZE = 20;

const toDate = (v) => {
  if (!v) return new Date();
  const d = v?.toDate?.() || new Date(v);
  return isNaN(d) ? new Date() : d;
};

const money = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

const dayLabel = (d) => {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
};

// Category icon + color (full class names so Tailwind can detect them)
const categoryMeta = {
  Food: { icon: Utensils, style: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300' },
  Transport: { icon: Car, style: 'bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300' },
  Shopping: { icon: ShoppingBag, style: 'bg-pink-100 text-pink-600 dark:bg-pink-500/15 dark:text-pink-300' },
  Bills: { icon: Receipt, style: 'bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300' },
  Entertainment: { icon: Film, style: 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300' },
  Salary: { icon: Briefcase, style: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300' },
  Freelance: { icon: Laptop, style: 'bg-teal-100 text-teal-600 dark:bg-teal-500/15 dark:text-teal-300' },
  Investment: { icon: TrendingUp, style: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300' },
  Other: { icon: MoreHorizontal, style: 'bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-300' },
};

export default function TransactionList({ transactions, onDelete }) {
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmId, setConfirmId] = useState(null);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const counts = useMemo(
    () => ({
      all: transactions.length,
      income: transactions.filter((t) => t.type === 'income').length,
      expense: transactions.filter((t) => t.type === 'expense').length,
    }),
    [transactions]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transactions.filter(
      (t) =>
        (filterType === 'all' || t.type === filterType) &&
        (!q ||
          t.description?.toLowerCase().includes(q) ||
          t.category?.toLowerCase().includes(q))
    );
  }, [transactions, filterType, search]);

  const sorted = useMemo(
    () =>
      [...filtered].sort((a, b) =>
        sortBy === 'amount'
          ? parseFloat(b.amount) - parseFloat(a.amount)
          : toDate(b.createdAt) - toDate(a.createdAt)
      ),
    [filtered, sortBy]
  );

  const shown = sorted.slice(0, visible);

  // Date groups (by-amount view is one flat list)
  const groups = useMemo(() => {
    if (sortBy === 'amount') {
      return [{ key: 'amount', label: 'Highest amount first', items: shown, net: null }];
    }
    const map = new Map();
    shown.forEach((t) => {
      const d = toDate(t.createdAt);
      const key = d.toDateString();
      if (!map.has(key)) map.set(key, { key, label: dayLabel(d), items: [], net: 0 });
      const g = map.get(key);
      g.items.push(t);
      g.net += (t.type === 'income' ? 1 : -1) * parseFloat(t.amount || 0);
    });
    return [...map.values()];
  }, [shown, sortBy]);

  const sum = (type) =>
    filtered
      .filter((t) => t.type === type)
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);

  const filterTabs = [
    { id: 'all', label: 'All', active: 'text-indigo-600 dark:text-indigo-300' },
    { id: 'income', label: 'Income', active: 'text-emerald-600 dark:text-emerald-300' },
    { id: 'expense', label: 'Expense', active: 'text-rose-600 dark:text-rose-300' },
  ];

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="mb-2 text-lg font-bold text-slate-900 dark:text-white">
          No transactions yet
        </h3>
        <p className="mx-auto max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Add your first transaction to start tracking your finances
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisible(PAGE_SIZE);
          }}
          placeholder="Search by description or category..."
          className="w-full rounded-xl border border-slate-200 bg-white/80 py-2.5 pl-11 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:placeholder-slate-500"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters + sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex w-full rounded-2xl bg-slate-100 p-1 dark:bg-slate-800/80 sm:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setFilterType(tab.id);
                setVisible(PAGE_SIZE);
              }}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all sm:flex-none ${
                filterType === tab.id
                  ? `bg-white shadow-sm dark:bg-slate-700 ${tab.active}`
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              <span className="rounded-full bg-slate-200/70 px-1.5 text-[11px] dark:bg-slate-600/60">
                {counts[tab.id]}
              </span>
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <option value="date">Newest first</option>
          <option value="amount">Highest amount</option>
        </select>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-2 rounded-2xl bg-gradient-to-r from-indigo-50 to-fuchsia-50 p-3 text-center ring-1 ring-indigo-100 dark:from-indigo-500/10 dark:to-fuchsia-500/10 dark:ring-white/5 sm:gap-4 sm:p-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Showing</p>
          <p className="text-sm font-bold text-slate-900 dark:text-white sm:text-base">
            {filtered.length}
            <span className="font-medium text-slate-400"> / {transactions.length}</span>
          </p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Income</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 sm:text-base">{money(sum('income'))}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">Expense</p>
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 sm:text-base">{money(sum('expense'))}</p>
        </div>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">No results found</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try a different search or filter.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {groups.map((g) => (
            <div key={g.key} className="space-y-2.5">
              <div className="sticky top-16 z-10 flex items-center justify-between rounded-xl bg-white/90 px-2 py-2 backdrop-blur dark:bg-slate-900/90">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{g.label}</h3>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {g.items.length}
                  </span>
                </div>
                {g.net !== null && (
                  <span className={`text-xs font-bold ${g.net >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {g.net >= 0 ? '+' : '-'}{money(Math.abs(g.net))}
                  </span>
                )}
              </div>

              {g.items.map((t) => {
                const income = t.type === 'income';
                const meta = categoryMeta[t.category] || categoryMeta.Other;
                const Icon = meta.icon;
                const confirming = confirmId === t.id;

                return (
                  <div
                    key={t.id}
                    className={`group flex items-center gap-3 rounded-2xl border bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800/60 sm:p-4 ${
                      confirming
                        ? 'border-rose-300 dark:border-rose-500/50'
                        : 'border-slate-100 dark:border-white/5 dark:hover:border-white/10'
                    }`}
                  >
                    <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${meta.style}`}>
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                        {t.description}
                      </h4>
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <span className="truncate">{t.category}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="shrink-0">
                          {toDate(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className={`text-right text-base font-extrabold sm:text-lg ${income ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                      {income ? '+' : '-'}{money(Math.abs(t.amount))}
                    </div>

                    {confirming ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            onDelete(t.id);
                            setConfirmId(null);
                          }}
                          className="rounded-lg bg-rose-500 p-2 text-white transition hover:bg-rose-600 active:scale-90"
                          aria-label="Confirm delete"
                          title="Confirm delete"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setConfirmId(null)}
                          className="rounded-lg bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200 active:scale-90 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                          aria-label="Cancel"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmId(t.id)}
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-500/10 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {sorted.length > visible && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="w-full rounded-xl border border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10 dark:hover:text-indigo-300"
            >
              Show more ({sorted.length - visible} remaining)
            </button>
          )}
        </div>
      )}
    </div>
  );
}