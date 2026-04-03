import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(n);
}

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
    <svg width={w} height={h}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#sg-${color.replace('#','')})`} />
      <path d={linePath} stroke={color} strokeWidth="2.5" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  sub,
  change,
  changeUp,
  icon,
  gradient,
  accentColor,
  sparkValues,
  badge
}: any) {
  return (
    <div
      className="
        relative overflow-hidden rounded-2xl

        /* LIGHT MODE */
        bg-gradient-to-br from-white via-blue-50/70 to-indigo-50/70
        border border-blue-100/60
        shadow-[0_15px_40px_rgba(59,130,246,0.15)]
        hover:shadow-[0_25px_70px_rgba(59,130,246,0.25)]

        /* DARK MODE (NEW PREMIUM) */
        dark:bg-gradient-to-br dark:from-[#0b1220] dark:to-[#071a2f]
        dark:border-white/10
        dark:shadow-[0_20px_60px_rgba(0,0,0,0.6)]

        hover:-translate-y-1 hover:scale-[1.02]
        transition-all duration-300 ease-out
      "
    >
      {/* 🔥 TOP LINE */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background: 'linear-gradient(90deg,#3b82f6,#6366f1,#0ea5e9)'
        }}
      />

      {/* 🌈 LIGHT MODE GLOW */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full" />

      {/* 🌌 DARK MODE GLOW */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-cyan-400/10 blur-3xl rounded-full dark:block hidden" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 blur-3xl rounded-full dark:block hidden" />

      <div className="relative p-6">

        {/* HEADER */}
        <div className="flex justify-between mb-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-white/70">
              {label}
            </p>

            {badge && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full border"
                style={{
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                  background: `${accentColor}20`
                }}
              >
                {badge}
              </span>
            )}
          </div>

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-lg"
            style={{ background: gradient }}
          >
            {icon}
          </div>
        </div>

        {/* VALUE */}
        <div className="mb-4">
          <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
            {value}
          </span>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-end">
          <div>
            {change && (
              <div className="flex items-center gap-1 mb-1">
                {changeUp
                  ? <ArrowUpRight className="h-4 w-4 text-green-500" />
                  : <ArrowDownRight className="h-4 w-4 text-red-500" />
                }
                <span className={`text-xs font-semibold ${changeUp ? 'text-green-600' : 'text-red-500'}`}>
                  {change}
                </span>
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-white/60">
              {sub}
            </p>
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
    let income = 0, expense = 0;

    transactions.forEach(tx => {
      if (tx.type === 'income') income += tx.amount;
      else expense += Math.abs(tx.amount);
    });

    return {
      balance: income - expense,
      income,
      expense
    };
  }, [transactions]);

  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-3">

      <StatCard
        label="Net Balance"
        value={formatCurrency(stats.balance)}
        sub="Total balance"
        change="+52% savings"
        changeUp
        icon={<Wallet className="h-5 w-5" />}
        gradient="linear-gradient(135deg,#3b82f6,#6366f1)"
        accentColor="#3b82f6"
        badge="6-Month"
      />

      <StatCard
        label="Income"
        value={formatCurrency(stats.income)}
        sub="All income"
        change="+12%"
        changeUp
        icon={<TrendingUp className="h-5 w-5" />}
        gradient="linear-gradient(135deg,#10b981,#059669)"
        accentColor="#10b981"
      />

      <StatCard
        label="Expenses"
        value={formatCurrency(stats.expense)}
        sub="All expenses"
        change="-3%"
        changeUp={false}
        icon={<TrendingDown className="h-5 w-5" />}
        gradient="linear-gradient(135deg,#ef4444,#dc2626)"
        accentColor="#ef4444"
      />

    </div>
  );
}