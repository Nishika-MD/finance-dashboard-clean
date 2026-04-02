import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function formatCurrency(n: number, compact = false) {
  if (compact && Math.abs(n) >= 1000) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
}

// Tiny sparkline component using SVG
function Sparkline({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  });
  const areaPath = `M0,${h} L${pts.join(' L')} L${w},${h} Z`;
  const linePath = `M${pts.join(' L')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={linePath} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface CardProps {
  label: string;
  value: string;
  sub: string;
  change?: string;
  changeUp?: boolean;
  icon: React.ReactNode;
  gradient: string;
  accentColor: string;
  sparkValues?: number[];
  testId: string;
  badge?: string;
}

function StatCard({ label, value, sub, change, changeUp, icon, gradient, accentColor, sparkValues, testId, badge }: CardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] group cursor-default"
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
      data-testid={testId}
    >
      {/* Gradient top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: gradient }} />

      {/* Background glow blob */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{ background: accentColor }} />

      <div className="relative p-6">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-0.5">{label}</p>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border"
                style={{ color: accentColor, borderColor: `${accentColor}40`, background: `${accentColor}15` }}>
                {badge}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{ background: gradient }}>
            <div className="text-white opacity-90">{icon}</div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-4">
          <span className="text-[2rem] font-extrabold tracking-tight text-white leading-none tabular-nums"
            data-testid={`text-${testId}`}>
            {value}
          </span>
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between">
          <div>
            {change && (
              <div className="flex items-center gap-1 mb-1">
                {changeUp
                  ? <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
                  : <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
                }
                <span className={`text-xs font-semibold ${changeUp ? 'text-emerald-400' : 'text-rose-400'}`}>{change}</span>
              </div>
            )}
            <p className="text-xs text-white/35">{sub}</p>
          </div>
          {sparkValues && <Sparkline values={sparkValues} color={accentColor} />}
        </div>
      </div>
    </div>
  );
}

export function SummaryCards() {
  const { transactions } = useAppContext();

  const stats = useMemo(() => {
    const byMonth: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(tx => {
      const m = tx.date.substring(0, 7);
      if (!byMonth[m]) byMonth[m] = { income: 0, expense: 0 };
      if (tx.type === 'income') byMonth[m].income += tx.amount;
      else byMonth[m].expense += Math.abs(tx.amount);
    });

    const months = Object.keys(byMonth).sort();
    const balanceSpark = months.map((m, i) => {
      let cum = 0;
      months.slice(0, i + 1).forEach(mm => cum += byMonth[mm].income - byMonth[mm].expense);
      return cum;
    });
    const incomeSpark = months.map(m => byMonth[m].income);
    const expenseSpark = months.map(m => byMonth[m].expense);

    const totalIncome = transactions.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0);
    const totalExpense = transactions.filter(tx => tx.type === 'expense').reduce((s, tx) => s + Math.abs(tx.amount), 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

    return { totalIncome, totalExpense, balance, savingsRate, balanceSpark, incomeSpark, expenseSpark };
  }, [transactions]);

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3" data-testid="summary-cards">
      <StatCard
        label="Net Balance"
        value={formatCurrency(stats.balance)}
        sub="Total across all months"
        change={`${stats.savingsRate.toFixed(1)}% savings rate`}
        changeUp={stats.savingsRate >= 0}
        icon={<Wallet className="h-5 w-5" />}
        gradient="linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
        accentColor="#818cf8"
        sparkValues={stats.balanceSpark}
        testId="total-balance"
        badge="6-Month Total"
      />
      <StatCard
        label="Total Income"
        value={formatCurrency(stats.totalIncome)}
        sub="Salary · Freelance · Investments"
        change="+12.4% vs prev period"
        changeUp
        icon={<TrendingUp className="h-5 w-5" />}
        gradient="linear-gradient(135deg, #059669 0%, #10b981 100%)"
        accentColor="#34d399"
        sparkValues={stats.incomeSpark}
        testId="total-income"
      />
      <StatCard
        label="Total Expenses"
        value={formatCurrency(stats.totalExpense)}
        sub="All outflows this period"
        change="-3.1% vs prev period"
        changeUp={false}
        icon={<TrendingDown className="h-5 w-5" />}
        gradient="linear-gradient(135deg, #be185d 0%, #f43f5e 100%)"
        accentColor="#fb7185"
        sparkValues={stats.expenseSpark}
        testId="total-expenses"
      />
    </div>
  );
}
