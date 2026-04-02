import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format, parseISO } from 'date-fns';

function CustomTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const val = payload[0].value;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0d1117]/95 backdrop-blur-xl px-4 py-3 shadow-2xl">
      <p className="text-xs text-white/40 mb-1 font-medium">{label}</p>
      <p className="text-xl font-extrabold text-white tabular-nums">
        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(val)}
      </p>
      <p className="text-[10px] text-indigo-400 mt-0.5 font-semibold">Cumulative Balance</p>
    </div>
  );
}

export function BalanceTrendChart() {
  const { transactions } = useAppContext();

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
    <div className="rounded-2xl border border-white/[0.07] p-6 h-full"
      style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400 mb-1">Cumulative Growth</p>
          <h3 className="text-base font-bold text-white">Balance Trend</h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-white tabular-nums">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(latest)}
          </p>
          <p className={`text-xs font-semibold mt-0.5 ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {pctChange >= 0 ? '+' : ''}{pctChange.toFixed(1)}% total growth
          </p>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="h-[260px] flex items-center justify-center text-white/30 text-sm">No data available</div>
      ) : (
        <div className="h-[270px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                  <stop offset="60%" stopColor="#6366f1" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="50%" stopColor="#c084fc" />
                  <stop offset="100%" stopColor="#f472b6" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter', fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'Inter' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `$${(v / 1000).toFixed(0)}k`}
                width={42}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area
                type="monotone"
                dataKey="balance"
                stroke="url(#lineGrad)"
                strokeWidth={2.5}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 6, fill: '#818cf8', stroke: '#050810', strokeWidth: 2 }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
