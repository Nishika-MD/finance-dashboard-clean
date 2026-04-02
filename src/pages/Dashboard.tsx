import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { SummaryCards } from '../components/SummaryCards';
import { BalanceTrendChart } from '../components/BalanceTrendChart';
import { SpendingPieChart } from '../components/SpendingPieChart';
import { TransactionTable } from '../components/TransactionTable';
import { InsightsSection } from '../components/InsightsSection';
import { Moon, Sun, TrendingUp, Shield, Eye, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function RoleToggle() {
  const { role, setRole } = useAppContext();
  return (
    <div
      className="flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm"
      data-testid="role-toggle"
    >
      <button
        onClick={() => setRole('admin')}
        data-testid="button-role-admin"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          role === 'admin'
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <Shield className="h-3 w-3" />
        Admin
      </button>
      <button
        onClick={() => setRole('viewer')}
        data-testid="button-role-viewer"
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
          role === 'viewer'
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/30'
            : 'text-white/50 hover:text-white/80'
        }`}
      >
        <Eye className="h-3 w-3" />
        Viewer
      </button>
    </div>
  );
}

export default function Dashboard() {
  const { role } = useAppContext();
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    document.documentElement.classList.add('dark');
    setTheme('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-white overflow-x-hidden">

      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-[100px]"
          style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-[0.05] blur-[80px]"
          style={{ background: 'radial-gradient(circle, #10b981, transparent)' }} />
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
      </div>

      {/* Header */}
      <header className="relative z-30 w-full border-b border-white/[0.07] bg-[#050810]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>
              <div className="absolute inset-0 rounded-xl blur-md opacity-50"
                style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }} />
              <TrendingUp className="relative h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">FinTrack</span>
                <span className="hidden sm:flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30 text-indigo-400 bg-indigo-500/10">
                  <Sparkles className="h-2.5 w-2.5" />
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-white/40 hidden sm:block">
                {role === 'admin' ? 'Administrator' : 'View Only'}
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <RoleToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              data-testid="button-theme-toggle"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-[1400px] mx-auto px-6 py-10 space-y-10">

        {/* Hero / Page Title */}
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-indigo-400">Financial Overview</span>
              <span className="inline-block w-12 h-px bg-gradient-to-r from-indigo-500 to-transparent" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white leading-none">
              Your{' '}
              <span style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Dashboard
              </span>
            </h1>
            <p className="mt-2 text-sm text-white/40">Complete financial overview for Jan — Jun 2026</p>
          </div>

          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-xl border border-white/10 bg-white/[0.04]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs text-white/50 font-medium">Live Data</span>
          </div>
        </div>

        {/* Summary Cards */}
        <SummaryCards />

        {/* Charts Row */}
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <BalanceTrendChart />
          </div>
          <div className="lg:col-span-1">
            <SpendingPieChart />
          </div>
        </div>

        {/* Insights */}
        <div>
          <SectionLabel label="Analytics" title="Spending Insights" />
          <InsightsSection />
        </div>

        {/* Transactions */}
        <div>
          <SectionLabel label="Activity" title="Recent Transactions" />
          <TransactionTable />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-white/25">FinTrack &copy; 2026. Built for Zorync.</p>
          <p className="text-xs text-white/25">All data is mock &mdash; for demonstration only</p>
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ label, title }: { label: string; title: string }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-0.5">{label}</p>
        <h2 className="text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}
