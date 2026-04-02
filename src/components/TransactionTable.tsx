import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Transaction } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ChevronsUpDown, Pencil, Search, Plus, SlidersHorizontal } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc';

const CATEGORY_COLORS: Record<string, string> = {
  Housing: '#818cf8',
  Food: '#f87171',
  Transport: '#fb923c',
  Entertainment: '#facc15',
  Healthcare: '#f43f5e',
  Shopping: '#c084fc',
  Utilities: '#22d3ee',
  Income: '#34d399',
  Freelance: '#f97316',
  Investment: '#4ade80',
};

function SortIcon({ col, sortKey, sortDir }: { col: string; sortKey: string | null; sortDir: SortDir }) {
  if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-30" />;
  return sortDir === 'asc'
    ? <ArrowUp className="h-3 w-3 text-indigo-400" />
    : <ArrowDown className="h-3 w-3 text-indigo-400" />;
}

export function TransactionTable() {
  const { filteredTransactions, filters, setFilters, role, transactions } = useAppContext();
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | undefined>();

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('asc'); }
  };

  const sorted = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortKey, sortDir]);

  const uniqueMonths = useMemo(() => {
    const s = new Set<string>();
    transactions.forEach(tx => s.add(tx.date.substring(0, 7)));
    return Array.from(s).sort().reverse();
  }, [transactions]);

  const handleEdit = (tx: Transaction) => { setEditingTx(tx); setIsFormOpen(true); };
  const handleAdd = () => { setEditingTx(undefined); setIsFormOpen(true); };

  const inputCls = "h-9 text-sm bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus:border-indigo-500/50 focus:ring-indigo-500/20 rounded-lg";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-2xl border border-white/[0.07] p-4"
        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex items-center gap-2 text-white/40">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="text-xs font-semibold">Filters</span>
          </div>

          <div className="flex flex-wrap gap-2 flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
              <Input
                placeholder="Search transactions..."
                className={`${inputCls} pl-8 w-52`}
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                data-testid="input-search"
              />
            </div>

            <Select value={filters.category} onValueChange={val => setFilters({ ...filters, category: val })}>
              <SelectTrigger className={`${inputCls} w-36`} data-testid="select-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {['Housing','Food','Transport','Entertainment','Healthcare','Shopping','Utilities','Income','Freelance','Investment'].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.type} onValueChange={val => setFilters({ ...filters, type: val })}>
              <SelectTrigger className={`${inputCls} w-28`} data-testid="select-type">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.month} onValueChange={val => setFilters({ ...filters, month: val })}>
              <SelectTrigger className={`${inputCls} w-32`} data-testid="select-month">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-[#0d1117] border-white/10 text-white">
                <SelectItem value="all">All Months</SelectItem>
                {uniqueMonths.map(m => (
                  <SelectItem key={m} value={m}>{format(parseISO(`${m}-01`), 'MMM yyyy')}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <span className="text-xs text-white/30 whitespace-nowrap tabular-nums">
              {sorted.length} result{sorted.length !== 1 ? 's' : ''}
            </span>
            {role === 'admin' && (
              <Button
                onClick={handleAdd}
                size="sm"
                className="h-9 text-xs gap-1.5 rounded-lg font-semibold"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                data-testid="button-add-transaction"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Transaction
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-white/[0.07] overflow-hidden"
        style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)' }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {[
                  { key: 'date', label: 'Date', w: 'w-32' },
                  { key: 'description', label: 'Description', w: '' },
                  { key: 'category', label: 'Category', w: 'w-36' },
                  { key: 'type', label: 'Type', w: 'w-28' },
                  { key: 'amount', label: 'Amount', w: 'w-32', right: true },
                ].map(col => (
                  <th
                    key={col.key}
                    className={`${col.w} ${col.right ? 'text-right' : ''} px-5 py-3.5 text-[10px] font-bold text-white/30 uppercase tracking-widest cursor-pointer select-none hover:text-white/60 transition-colors`}
                    onClick={() => handleSort(col.key as SortKey)}
                  >
                    <span className={`flex items-center gap-1.5 ${col.right ? 'justify-end' : ''}`}>
                      {col.right && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                      {col.label}
                      {!col.right && <SortIcon col={col.key} sortKey={sortKey} sortDir={sortDir} />}
                    </span>
                  </th>
                ))}
                {role === 'admin' && <th className="w-16 px-5 py-3.5" />}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={role === 'admin' ? 6 : 5}
                    className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center">
                        <Search className="h-5 w-5 text-white/20" />
                      </div>
                      <p className="text-sm text-white/30">No transactions match your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                sorted.map((tx, idx) => (
                  <tr
                    key={tx.id}
                    className={`group hover:bg-white/[0.03] transition-colors ${idx !== sorted.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                    data-testid={`row-transaction-${tx.id}`}
                  >
                    <td className="px-5 py-3.5 text-sm text-white/40 whitespace-nowrap font-medium">
                      {format(parseISO(tx.date), 'MMM d, yyyy')}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-sm font-medium text-white/80">{tx.description}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: `${CATEGORY_COLORS[tx.category] ?? '#6366f1'}18`,
                          color: CATEGORY_COLORS[tx.category] ?? '#6366f1',
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[tx.category] ?? '#6366f1' }} />
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${
                        tx.type === 'income'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}>
                        {tx.type === 'income' ? 'Income' : 'Expense'}
                      </span>
                    </td>
                    <td className={`px-5 py-3.5 text-right text-sm font-extrabold tabular-nums ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                      {tx.type === 'income' ? '+' : ''}
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-all rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                          onClick={() => handleEdit(tx)}
                          data-testid={`button-edit-${tx.id}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        transaction={editingTx}
      />
    </div>
  );
}
