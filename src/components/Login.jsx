import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  DollarSign,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  PieChart,
  ShieldCheck,
} from 'lucide-react';

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
  const { login } = useAuth();
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

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white/80 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15';

  return (
    <div className="relative flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-fuchsia-300/25 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-200/30 blur-3xl" />
      </div>

      {/* Left brand panel (desktop only) */}
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
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-indigo-300 to-fuchsia-300 bg-clip-text text-transparent">
              let&apos;s check your money.
            </span>
          </h1>
          <p className="mt-4 max-w-sm text-slate-300">
            Log in to see your latest balance, income and expenses, all in one
            place.
          </p>

          <ul className="mt-8 space-y-4">
            {[
              { icon: <TrendingUp className="h-4 w-4" />, t: 'Real-time balance & insights' },
              { icon: <PieChart className="h-4 w-4" />, t: 'Simple income vs expense tracking' },
              { icon: <ShieldCheck className="h-4 w-4" />, t: 'Private & secured by Firebase' },
            ].map((f) => (
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
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center justify-center gap-3 lg:hidden">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-500/30">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Spend<span className="text-indigo-600">Wise</span>
            </span>
          </div>

          <div className="rounded-3xl border border-white bg-white/80 p-6 shadow-2xl shadow-slate-300/50 backdrop-blur-xl sm:p-8">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                Welcome back 👋
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Login to continue to your dashboard.
              </p>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Email
                </label>
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Password
                </label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
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

            <p className="mt-6 text-center text-sm text-slate-600">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-semibold text-indigo-600 hover:text-fuchsia-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}