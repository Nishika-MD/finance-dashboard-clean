import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { TrendingUp, TrendingDown, Target, Zap } from 'lucide-react';

function MetricCard({ label, value, sub, icon, color }: any) {
  return (
    <div className="
      rounded-2xl p-5
      bg-white dark:bg-[#0b0f1a]
      border border-gray-200 dark:border-white/10
      shadow-sm
    ">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <p className="text-xs font-semibold text-gray-500 dark:text-white/40 uppercase">
          {label}
        </p>
      </div>

      <p className="text-lg font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs text-gray-500 dark:text-white/40">{sub}</p>
    </div>
  );
}

function CustomBarTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className={`
      rounded-xl px-4 py-3 shadow-xl
      ${isDark ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}
      border
    `}>
      <p className={`text-xs mb-2 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
        {label}
      </p>

      {payload.map((p: any, i: number) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ background: p.fill }} />
          <span className={isDark ? 'text-white/60' : 'text-gray-600'}>
            {p.name}:
          </span>
          <span className={isDark ? 'text-white' : 'text-gray-900'}>
            ${p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function InsightsSection() {
  const { transactions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const insights = useMemo(() => {
    if (!transactions.length) return null;

    const expenses = transactions.filter(tx => tx.type === 'expense');

    const categoryTotals = expenses.reduce((acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {} as Record<string, number>);

    const [highestCat, highestCatAmount] =
      Object.entries(categoryTotals).reduce((max, cur) =>
        cur[1] > max[1] ? cur : max, ['', 0]);

    const monthlyData: any = {};

    transactions.forEach(tx => {
      const m = tx.date.substring(0, 7);
      if (!monthlyData[m]) monthlyData[m] = { in: 0, out: 0 };
      if (tx.type === 'income') monthlyData[m].in += tx.amount;
      else monthlyData[m].out += Math.abs(tx.amount);
    });

    const chartData = Object.entries(monthlyData).map(([month, d]: any) => ({
      month: format(parseISO(`${month}-01`), 'MMM'),
      Income: d.in,
      Expenses: d.out
    }));

    return { highestCat, highestCatAmount, chartData };
  }, [transactions]);

  if (!insights) return null;

  return (
    <div className="space-y-5">

      {/* Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Top Category" value={insights.highestCat}
          sub="Highest spending"
          icon={<Target className="h-4 w-4" />} color="#f43f5e" />
      </div>

      {/* Chart */}
      <div className="
        rounded-2xl p-6
        bg-white dark:bg-[#0b0f1a]
        border border-gray-200 dark:border-white/10
      ">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Income vs Expenses
        </h3>

        <div className="h-[280px]">
          <ResponsiveContainer>
            <BarChart data={insights.chartData}>
              
              <CartesianGrid stroke={isDark ? "#1f2937" : "#e5e7eb"} />

              <XAxis
                dataKey="month"
                tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
              />

              <YAxis
                tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
              />

              <Tooltip content={<CustomBarTooltip isDark={isDark} />} />

              <Bar dataKey="Income" fill={isDark ? "#10b981" : "#059669"} />
              <Bar dataKey="Expenses" fill={isDark ? "#f43f5e" : "#dc2626"} />

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}