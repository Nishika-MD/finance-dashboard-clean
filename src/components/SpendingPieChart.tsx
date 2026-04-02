import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS: Record<string, string> = {
  Housing:       '#818cf8',
  Food:          '#f87171',
  Transport:     '#fb923c',
  Entertainment: '#facc15',
  Shopping:      '#c084fc',
  Utilities:     '#22d3ee',
  Healthcare:    '#34d399',
  Investment:    '#4ade80',
  Other:         '#94a3b8',
};

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) {
  if (!active || !payload?.length) return null;
  const { name, value } = payload[0];
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117]/95 backdrop-blur-xl px-4 py-2.5 shadow-2xl">
      <div className="flex items-center gap-2 mb-1">
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: COLORS[name] ?? '#94a3b8' }} />
        <span className="text-xs font-semibold text-white">{name}</span>
      </div>
      <p className="text-base font-extrabold text-white tabular-nums">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
      </p>
    </div>
  );
}

export function SpendingPieChart() {
  const { transactions } = useAppContext();

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
    return { data: entries.map(([name, value]) => ({ name, value })), total };
  }, [transactions]);

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(n);

  return (
    <div className="rounded-2xl border border-white/[0.07] p-6 h-full flex flex-col"
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
      {/* Header */}
      <div className="mb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Breakdown</p>
        <h3 className="text-base font-bold text-white">Spending by Category</h3>
      </div>

      {/* Donut */}
      <div className="relative flex justify-center mb-5">
        <div style={{ width: 180, height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={2}
                dataKey="value"
                strokeWidth={0}
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name] ?? '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-white/40 font-semibold mb-0.5">TOTAL</p>
          <p className="text-lg font-extrabold text-white tabular-nums">{fmt(total)}</p>
        </div>
      </div>

      {/* Legend bars */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {data.map(({ name, value }) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          const color = COLORS[name] ?? '#94a3b8';
          return (
            <div key={name} className="group">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                  <span className="text-xs text-white/70 font-medium">{name}</span>
                </div>
                <span className="text-xs font-bold text-white/50 tabular-nums">{pct.toFixed(0)}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}60` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
