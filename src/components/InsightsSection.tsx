import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

function MetricCard({ label, value, sub, icon, color, testId }: {
  label: string; value: string; sub: string;
  icon: React.ReactNode; color: string; testId?: string;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/[0.07] p-5 group hover:border-white/15 transition-all duration-300"
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}
      data-testid={testId}
    >
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"
        style={{ background: color }} />
      <div className="flex items-center gap-2.5 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg"
          style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-xl font-extrabold text-white tracking-tight mb-0.5">{value}</p>
      <p className="text-xs text-white/35">{sub}</p>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117]/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/40 font-medium mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: p.fill }} />
          <span className="text-white/50">{p.name}:</span>
          <span className="font-bold text-white tabular-nums">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InsightsSection() {
  const { transactions } = useAppContext();

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    const expenses = transactions.filter(tx => tx.type === 'expense');

    const categoryTotals = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {} as Record<string, number>);

    const [highestCat, highestCatAmount] = Object.entries(categoryTotals).reduce(
      (max, cur) => (cur[1] > max[1] ? cur : max), ['', 0]
    );

    const monthlyData: Record<string, { in: number; out: number }> = {};
    transactions.forEach(tx => {
      const m = tx.date.substring(0, 7);
      if (!monthlyData[m]) monthlyData[m] = { in: 0, out: 0 };
      if (tx.type === 'income') monthlyData[m].in += tx.amount;
      else monthlyData[m].out += Math.abs(tx.amount);
    });

    let bestMonth = '';
    let bestNet = -Infinity;
    let worstMonth = '';
    let worstOut = -Infinity;

    const chartData = Object.entries(monthlyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, d]) => {
        const net = d.in - d.out;
        if (net > bestNet) { bestNet = net; bestMonth = month; }
        if (d.out > worstOut) { worstOut = d.out; worstMonth = month; }
        return { month: format(parseISO(`${month}-01`), 'MMM'), Income: Math.round(d.in), Expenses: Math.round(d.out) };
      });

    const totalMonths = Object.keys(monthlyData).length || 1;
    const avgExpenses = expenses.reduce((s, tx) => s + Math.abs(tx.amount), 0) / totalMonths;

    return {
      highestCat, highestCatAmount, chartData, avgExpenses, bestNet,
      bestMonth: bestMonth ? format(parseISO(`${bestMonth}-01`), 'MMM yyyy') : 'N/A',
      worstMonth: worstMonth ? format(parseISO(`${worstMonth}-01`), 'MMM yyyy') : 'N/A',
    };
  }, [transactions]);

  if (!insights) return null;

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n);

  return (
    <div className="space-y-5">
      {/* Metric cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Top Spend Category" value={insights.highestCat}
          sub={`${fmt(insights.highestCatAmount)} total outflow`}
          icon={<Target className="h-4 w-4" />} color="#f43f5e" testId="insight-top-category" />
        <MetricCard label="Avg Monthly Spend" value={fmt(insights.avgExpenses)}
          sub="Across all 6 months"
          icon={<Zap className="h-4 w-4" />} color="#6366f1" testId="insight-avg-spend" />
        <MetricCard label="Best Savings Month" value={insights.bestMonth}
          sub={`Net +${fmt(insights.bestNet)} saved`}
          icon={<TrendingUp className="h-4 w-4" />} color="#10b981" testId="insight-best-month" />
        <MetricCard label="Highest Spend Month" value={insights.worstMonth}
          sub="Maximum cash outflow"
          icon={<TrendingDown className="h-4 w-4" />} color="#f59e0b" testId="insight-worst-month" />
      </div>

      {/* Monthly Bar Chart */}
      <div className="rounded-2xl border border-white/[0.07] p-6"
        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Monthly</p>
            <h3 className="text-base font-bold text-white">Income vs Expenses</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#10b981' }} />
              <span className="text-xs text-white/40 font-medium">Income</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: '#f43f5e' }} />
              <span className="text-xs text-white/40 font-medium">Expenses</span>
            </div>
          </div>
        </div>

        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={insights.chartData} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
              barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }}
                tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter' }}
                tickLine={false} axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} width={40} />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.025)' }} />
              <Bar dataKey="Income" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
                {insights.chartData.map((_, i) => (
                  <Cell key={i} fill="#10b981" fillOpacity={0.9} />
                ))}
              </Bar>
              <Bar dataKey="Expenses" radius={[4, 4, 0, 0]} maxBarSize={36} isAnimationActive={false}>
                {insights.chartData.map((_, i) => (
                  <Cell key={i} fill="#f43f5e" fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Observation */}
        <div className="mt-5 p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/[0.06]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Observation</p>
          </div>
          <p className="text-xs text-white/50 leading-relaxed">
            Your largest expense category is{' '}
            <span className="text-rose-400 font-semibold">{insights.highestCat}</span>.{' '}
            {insights.bestMonth} was your strongest month with a net gain of{' '}
            <span className="text-emerald-400 font-semibold">{fmt(insights.bestNet)}</span>.{' '}
            Average monthly spending sits at{' '}
            <span className="text-white font-semibold">{fmt(insights.avgExpenses)}</span> — tracking below income indicates healthy cash flow.
          </p>
        </div>
      </div>
    </div>
  );
}
