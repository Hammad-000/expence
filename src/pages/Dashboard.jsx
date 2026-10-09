// src/pages/Dashboard.jsx
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import TransactionForm from '../components/TransactionForm';
import TransactionList from '../components/TransactionList';
import { ThemeToggle } from '../context/ThemeContext';
import {
  LogOut,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Receipt,
  PiggyBank,
  Sparkles,
} from 'lucide-react';

const money = (n) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(n);

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

// Shared card style (light + dark)
const card =
  'rounded-3xl border border-white bg-white/80 shadow-xl shadow-slate-200/60 backdrop-blur transition-colors dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, 'transactions'),
      where('userId', '==', currentUser.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTransactions(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);

  async function handleAddTransaction(transaction) {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...transaction,
        userId: currentUser.uid,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  }

  async function handleDeleteTransaction(id) {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  const { totalIncome, totalExpense, balance, spentPct } = useMemo(() => {
    const inc = transactions
      .filter((t) => t.type === 'income')
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    const exp = transactions
      .filter((t) => t.type === 'expense')
      .reduce((s, t) => s + parseFloat(t.amount || 0), 0);
    return {
      totalIncome: inc,
      totalExpense: exp,
      balance: inc - exp,
      spentPct: inc > 0 ? Math.min((exp / inc) * 100, 100) : exp > 0 ? 100 : 0,
    };
  }, [transactions]);

  const isDemo = currentUser?.email === 'demo@spendwise.app';
  const userName = currentUser?.email?.split('@')[0] || 'there';
  const initial = userName.charAt(0).toUpperCase();
  const positive = balance >= 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-100 dark:border-slate-800" />
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Loading your expenses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-50 transition-colors dark:bg-slate-950">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-600/20" />
        <div className="absolute top-40 -right-32 h-96 w-96 rounded-full bg-fuchsia-300/25 blur-3xl dark:bg-fuchsia-600/15" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/70">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/30">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-xl">
              Spend<span className="text-indigo-600 dark:text-indigo-400">Wise</span>
            </h1>
            {isDemo && (
              <span className="hidden rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 sm:inline">
                Demo
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-bold text-white ring-2 ring-white dark:ring-slate-800">
                {initial}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-[11px] uppercase tracking-wider text-slate-400">
                  Signed in
                </p>
                <p className="max-w-[200px] truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {currentUser?.email}
                </p>
              </div>
            </div>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 active:scale-95 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-rose-500/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-300 sm:px-4"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10">
        {/* Hero balance card */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-2xl shadow-indigo-900/20 ring-1 ring-white/10 sm:p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/30 blur-3xl" />
          <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-fuchsia-500/20 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm text-indigo-200">
                <Sparkles className="h-4 w-4" />
                {greeting()}, <span className="font-semibold capitalize">{userName}</span>
              </p>
              <p className="mt-4 text-xs font-medium uppercase tracking-widest text-slate-400">
                Total Balance
              </p>
              <p
                className={`mt-1 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl ${
                  positive ? 'text-white' : 'text-amber-300'
                }`}
              >
                {money(balance)}
              </p>
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  positive
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'bg-amber-400/15 text-amber-300'
                }`}
              >
                {positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                {positive ? 'You are in the green' : 'Spending exceeds income'}
              </span>
            </div>

            <div className="w-full lg:max-w-sm">
              <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
                <span>Income spent</span>
                <span className="font-bold text-white">{spentPct.toFixed(0)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    spentPct < 60
                      ? 'bg-gradient-to-r from-emerald-400 to-teal-300'
                      : spentPct < 85
                      ? 'bg-gradient-to-r from-amber-400 to-orange-300'
                      : 'bg-gradient-to-r from-rose-500 to-pink-400'
                  }`}
                  style={{ width: `${spentPct}%` }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-[11px] text-slate-400">Income</p>
                  <p className="text-sm font-bold text-emerald-300 sm:text-base">{money(totalIncome)}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
                  <p className="text-[11px] text-slate-400">Expense</p>
                  <p className="text-sm font-bold text-rose-300 sm:text-base">{money(totalExpense)}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stat cards */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Income" value={money(totalIncome)} hint="All time earnings" icon={<TrendingUp className="h-5 w-5" />} tone="emerald" />
          <StatCard label="Total Expense" value={money(totalExpense)} hint="All time spendings" icon={<TrendingDown className="h-5 w-5" />} tone="rose" />
          <StatCard label="Transactions" value={transactions.length} hint={positive ? 'Keep saving!' : 'Watch your budget'} icon={<Receipt className="h-5 w-5" />} tone="indigo" />
        </section>

        {/* Form + List */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div id="add-form" className="scroll-mt-24 lg:col-span-1">
            <div className={`${card} p-6 lg:sticky lg:top-24`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Transaction</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Add income or expense</p>
                </div>
              </div>
              <TransactionForm onAdd={handleAddTransaction} />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className={`${card} overflow-hidden`}>
              <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Transactions</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} total
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Income
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Expense
                  </span>
                </div>
              </div>

              {transactions.length > 0 ? (
                <div className="p-3 sm:p-4">
                  <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
                </div>
              ) : (
                <div className="px-4 py-16 text-center">
                  <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-indigo-50 to-fuchsia-50 text-indigo-500 dark:from-indigo-500/15 dark:to-fuchsia-500/15 dark:text-indigo-300">
                    <PiggyBank className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">No transactions yet</h3>
                  <p className="mx-auto mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
                    Add your first transaction to start tracking your finances.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Mobile floating add button */}
      <a
        href="#add-form"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white shadow-xl shadow-indigo-500/40 transition active:scale-90 lg:hidden"
        aria-label="Add transaction"
      >
        <Plus className="h-6 w-6" />
      </a>

      {/* Mobile quick stats bar */}
      <div
        className="fixed bottom-4 left-3 z-40 flex items-center justify-around rounded-2xl border border-white/70 bg-white/85 px-3 py-2.5 shadow-xl shadow-slate-300/50 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/85 dark:shadow-black/40 sm:hidden"
        style={{ right: '5.25rem' }}
      >
        <MiniStat icon={<TrendingUp className="h-3.5 w-3.5" />} color="text-emerald-600 dark:text-emerald-400" value={money(totalIncome)} />
        <MiniStat icon={<TrendingDown className="h-3.5 w-3.5" />} color="text-rose-600 dark:text-rose-400" value={money(totalExpense)} />
        <MiniStat icon={<Wallet className="h-3.5 w-3.5" />} color={positive ? 'text-indigo-600 dark:text-indigo-300' : 'text-amber-600 dark:text-amber-400'} value={money(balance)} />
      </div>
    </div>
  );
}

const tones = {
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400' },
  rose: { bg: 'bg-rose-50 dark:bg-rose-500/10', icon: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400' },
  indigo: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: 'bg-indigo-500', text: 'text-indigo-600 dark:text-indigo-300' },
};

function StatCard({ label, value, hint, icon, tone }) {
  const t = tones[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white bg-white/80 p-5 shadow-lg shadow-slate-200/60 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/30">
      <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full ${t.bg} transition group-hover:scale-125`} />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">{value}</p>
          <p className={`mt-1 text-xs font-medium ${t.text}`}>{hint}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl text-white shadow-md ${t.icon}`}>{icon}</div>
      </div>
    </div>
  );
}

function MiniStat({ icon, color, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={color}>{icon}</span>
      <span className={`text-xs font-bold ${color}`}>{value}</span>
    </div>
  );
}