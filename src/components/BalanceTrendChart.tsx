import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';

function CustomTooltip({ active, payload, label, isDark }: any) {
  if (!active || !payload?.length) return null;

  const val = payload[0].value;

  return (
    <div className={`
      rounded-xl px-4 py-3 shadow-xl border
      ${isDark ? 'bg-[#0d1117] border-white/10' : 'bg-white border-gray-200'}
    `}>
      <p className={`text-xs mb-1 ${isDark ? 'text-white/40' : 'text-gray-500'}`}>
        {label}
      </p>

      <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        ${val}
      </p>

      <p className="text-[10px] text-blue-500 mt-1">
        Cumulative Balance
      </p>
    </div>
  );
}

export function BalanceTrendChart() {
  const { transactions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, pctChange } = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let running = 0;
    const monthly: Record<string, number> = {};

    sorted.forEach(tx => {
      const m = tx.date.substring(0, 7);
      running += tx.amount;
      monthly[m] = running;
    });

    const entries = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b));

    const first = entries[0]?.[1] ?? 0;
    const last = entries[entries.length - 1]?.[1] ?? 0;
    const pct = first !== 0 ? ((last - first) / Math.abs(first)) * 100 : 0;

    return {
      data: entries.map(([m, bal]) => ({
        month: format(parseISO(`${m}-01`), 'MMM yy'),
        balance: Math.round(bal),
      })),
      pctChange: pct,
    };
  }, [transactions]);

  const latest = data[data.length - 1]?.balance ?? 0;

  return (
    <div className="
      relative overflow-hidden rounded-2xl p-6 h-full

      /* 🔥 LIGHT MODE (MORE CONTRAST) */
      bg-white
      border border-blue-100/80
      shadow-[0_20px_60px_rgba(59,130,246,0.15)]

      /* 🌙 DARK MODE (KEEP + ENHANCE) */
      dark:bg-[#0b0f1a]
      dark:border-white/10

      transition-all duration-300
    ">

      {/* 🔥 TOP BLUE LINE */}
      <div className="absolute top-0 left-0 w-full h-[3px]
        bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400
      " />

      {/* 🌈 LIGHT MODE GLOW */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full" />

      {/* Header */}
      <div className="flex justify-between mb-6 relative">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-blue-600">
            Cumulative Growth
          </p>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Balance Trend
          </h3>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            ${latest}
          </p>
          <p className={`text-xs ${pctChange >= 0 ? 'text-green-600' : 'text-red-500'}`}>
            {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] relative">
        <ResponsiveContainer>
          <AreaChart data={data}>

            {/* GRID */}
            <CartesianGrid stroke={isDark ? "#1f2937" : "#e2e8f0"} />

            {/* AXIS */}
            <XAxis
              dataKey="month"
              tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
            />

            <YAxis
              tick={{ fill: isDark ? "#9ca3af" : "#374151" }}
            />

            <Tooltip content={<CustomTooltip isDark={isDark} />} />

            {/* 🔥 GRADIENT */}
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#3b82f6"
              strokeWidth={3}
              fill="url(#balanceGradient)"
            />

          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}