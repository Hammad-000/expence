// src/pages/Login.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import AuthLayout, { inputClass, labelClass } from '../components/AuthLayout';

// Demo account (auto-created on first use)
const DEMO_EMAIL = 'demo@spendwise.app';
const DEMO_PASSWORD = 'Demo@12345';

const friendlyError = (err) => {
  switch (err?.code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/network-request-failed':
      return 'Network error. Check your internet connection.';
    default:
      return 'Failed to log in: ' + err.message;
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(friendlyError(err));
    }
    setLoading(false);
  }

  async function handleDemoLogin() {
    try {
      setError('');
      setDemoLoading(true);
      try {
        await login(DEMO_EMAIL, DEMO_PASSWORD);
      } catch (err) {
        // First time: demo account doesn't exist yet, so create it
        if (
          err.code === 'auth/invalid-credential' ||
          err.code === 'auth/user-not-found'
        ) {
          await signup(DEMO_EMAIL, DEMO_PASSWORD);
        } else {
          throw err;
        }
      }
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.code === 'auth/email-already-in-use'
          ? 'Demo account password was changed. Please reset it in Firebase Console.'
          : friendlyError(err)
      );
    }
    setDemoLoading(false);
  }

  const busy = loading || demoLoading;

  return (
    <AuthLayout
      brandLine1="Welcome back,"
      brandLine2="let's check your money."
      brandText="Log in to see your latest balance, income and expenses, all in one place."
      title="Welcome back 👋"
      subtitle="Login to continue to your dashboard."
    >
      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:shadow-xl hover:shadow-indigo-500/40 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Logging in...
            </>
          ) : (
            <>
              Login
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-5 flex items-center gap-3 text-xs font-medium uppercase tracking-wider text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
        or
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>

      {/* Demo login */}
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/60 py-3 text-sm font-semibold text-indigo-700 transition hover:border-indigo-500 hover:bg-indigo-50 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/20"
      >
        {demoLoading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-300 border-t-indigo-600" />
            Opening demo...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            Try Demo Account
          </>
        )}
      </button>
      <p className="mt-2 text-center text-xs text-slate-400">
        No sign up needed. Explore the app with a sample account.
      </p>

      <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-indigo-600 hover:text-fuchsia-600 hover:underline dark:text-indigo-400">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}