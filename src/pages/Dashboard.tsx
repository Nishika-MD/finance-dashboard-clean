import { useAppContext } from '../context/AppContext';
import { SummaryCards } from '../components/SummaryCards';
import { BalanceTrendChart } from '../components/BalanceTrendChart';
import { SpendingPieChart } from '../components/SpendingPieChart';
import { TransactionTable } from '../components/TransactionTable';
import { InsightsSection } from '../components/InsightsSection';
import { Moon, Sun, TrendingUp, Shield, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from "@/context/ThemeContext";

function RoleToggle() {
  const { role, setRole } = useAppContext();

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-sm">
      {['admin', 'viewer'].map((r) => (
        <button
          key={r}
          onClick={() => setRole(r as any)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300 ${
            role === r
              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md scale-105'
              : 'text-gray-600 dark:text-white/50 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          {r === 'admin' ? <Shield className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
          {r}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { role } = useAppContext();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="
      min-h-screen
      bg-gradient-to-br from-[#e0ecff] via-[#f8fbff] to-[#eef2ff]
      dark:bg-gradient-to-br dark:from-[#050810] dark:to-[#0b0f1a]
      text-gray-900 dark:text-white
      overflow-x-hidden
      relative
    ">

      {/* BACKGROUND GLOW */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-[10%] w-[420px] h-[420px] bg-blue-500/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-120px] right-[10%] w-[420px] h-[420px] bg-indigo-500/20 blur-[140px] rounded-full" />
      </div>

      {/* HEADER */}
      <header className="relative z-30 w-full border-b border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-[#050810]/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">FinTrack</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full border border-blue-300 text-blue-600 bg-blue-100">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-gray-500 dark:text-white/40">
                {role === 'admin' ? 'Administrator' : 'View Only'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <RoleToggle />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-md shadow-sm hover:scale-110 transition"
            >
              {theme === 'light'
                ? <Moon className="h-4 w-4" />
                : <Sun className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN (FIXED PROPERLY) */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-10">

        {/* TITLE */}
        <div>
          <p className="text-xs uppercase tracking-widest text-blue-600 mb-2">
            Financial Overview
          </p>

          <h1 className="text-2xl sm:text-4xl font-extrabold">
            Your{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>

          <p className="mt-2 text-sm text-gray-600 dark:text-white/40">
            Complete financial overview
          </p>
        </div>

        {/* CARDS */}
        <SummaryCards />

        {/* CHARTS */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2 hover:scale-[1.01] transition">
            <BalanceTrendChart />
          </div>
          <div className="hover:scale-[1.01] transition">
            <SpendingPieChart />
          </div>
        </div>

        {/* INSIGHTS */}
        <InsightsSection />

        {/* TABLE */}
        <div className="hover:shadow-xl transition overflow-x-auto">
          <TransactionTable />
        </div>

      </main>
    </div>
  );
}