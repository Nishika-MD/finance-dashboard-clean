import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS: Record<string, string> = {
  Housing: '#3b82f6',
  Food: '#ef4444',
  Transport: '#f97316',
  Entertainment: '#eab308',
  Shopping: '#8b5cf6',
  Utilities: '#06b6d4',
  Healthcare: '#10b981',
  Investment: '#22c55e',
  Other: '#64748b',
};

function CustomTooltip({ active, payload, isDark }: any) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];

  return (
    <div className={`
      rounded-xl px-4 py-2 shadow-xl border
      ${isDark ? 'border-white/10 bg-[#0d1117]' : 'border-gray-200 bg-white'}
    `}>
      <p className="text-xs font-semibold">{name}</p>
      <p className="text-base font-bold">${value}</p>
    </div>
  );
}

export function SpendingPieChart() {
  const { transactions } = useAppContext();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const { data, total } = useMemo(() => {
    const map: Record<string, number> = {};
    transactions
      .filter(tx => tx.type === 'expense')
      .forEach(tx => {
        const cat = tx.category || 'Other';
        map[cat] = (map[cat] ?? 0) + Math.abs(tx.amount);
      });

    const entries = Object.entries(map).sort((a, b) => b[1] - a[1]);
    const total = entries.reduce((s, [, v]) => s + v, 0);

    return {
      data: entries.map(([name, value]) => ({ name, value })),
      total
    };
  }, [transactions]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact'
    }).format(n);

  return (
    <div className="
      relative overflow-hidden rounded-2xl p-6 h-full flex flex-col

      bg-white
      border border-blue-100/80
      shadow-[0_25px_80px_rgba(59,130,246,0.2)]

      dark:bg-[#0b0f1a]/80
      dark:border-white/10

      transition-all duration-500
    ">

      {/* 🔥 TOP GRADIENT */}
      <div className="absolute top-0 left-0 w-full h-[3px]
        bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400
      " />

      {/* 🌈 MULTI GLOW */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-400/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400/20 blur-3xl rounded-full animate-pulse" />

      {/* Header */}
      <div className="mb-5 relative">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-600">
          Breakdown
        </p>
        <h3 className="text-base font-bold text-gray-900 dark:text-white">
          Spending by Category
        </h3>
      </div>

      {/* Chart */}
      <div className="relative flex justify-center mb-5 group">
        <div style={{ width: 220, height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                animationDuration={1200}
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name]}
                    style={{
                      filter: 'drop-shadow(0px 0px 10px rgba(59,130,246,0.4))',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip isDark={isDark} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* CENTER */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-gray-500 dark:text-white/40">TOTAL</p>
          <p className="text-2xl font-extrabold text-blue-600 dark:text-white">
            {fmt(total)}
          </p>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        {data.map(({ name, value }) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          const color = COLORS[name];

          return (
            <div key={name} className="group">
              <div className="flex justify-between text-sm mb-1 font-medium">
                <span className="flex items-center gap-2 text-gray-800 dark:text-white/70">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                  {name}
                </span>
                <span className="text-gray-600 dark:text-white/50">
                  {pct.toFixed(0)}%
                </span>
              </div>

              <div className="h-2 bg-gray-200/80 dark:bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 group-hover:scale-x-105"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(to right, ${color}, ${color}cc)`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}