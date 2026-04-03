import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Transaction } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, ChevronsUpDown, Search, Plus, Trash2 } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc';

function SortIcon({ col, sortKey, sortDir }: any) {
  if (sortKey !== col) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return sortDir === 'asc'
    ? <ArrowUp className="h-3 w-3 text-blue-500" />
    : <ArrowDown className="h-3 w-3 text-blue-500" />;
}

export function TransactionTable() {
  const {
    filteredTransactions,
    filters,
    setFilters,
    role,
    deleteTransaction
  } = useAppContext();

  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const av = a[sortKey] as any;
      const bv = b[sortKey] as any;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortKey, sortDir]);

  return (
    <div className="space-y-5">

      {/* FILTER */}
      <div className="relative rounded-2xl p-4 bg-white border border-blue-100/80 shadow-md dark:bg-white/5 dark:border-white/10">
        <div className="flex gap-3 items-center">

          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="pl-8 h-10 bg-blue-50 border border-blue-200"
            />
          </div>

          {role === 'admin' && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="ml-auto bg-blue-500 text-white"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded-2xl overflow-hidden bg-white border border-blue-100 shadow-md dark:bg-[#0b0f1a]/80 dark:border-white/10">

        <table className="w-full text-sm">

          <thead className="bg-blue-50 border-b border-blue-100 dark:bg-white/5">
            <tr>
              {['date','description','category','type','amount'].map(col => (
                <th
                  key={col}
                  onClick={() => {
                    if (sortKey === col) {
                      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                    } else {
                      setSortKey(col as SortKey);
                      setSortDir('asc');
                    }
                  }}
                  className="px-5 py-3 text-left cursor-pointer"
                >
                  <span className="flex items-center gap-1">
                    {col}
                    <SortIcon col={col} sortKey={sortKey} sortDir={sortDir} />
                  </span>
                </th>
              ))}

              {role === 'admin' && <th className="px-5 py-3 text-right">Action</th>}
            </tr>
          </thead>

          <tbody>
            {sorted.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-blue-50 dark:hover:bg-white/5">

                <td className="px-5 py-3">
                  {format(parseISO(tx.date), 'MMM d')}
                </td>

                <td className="px-5 py-3 font-medium">
                  {tx.description}
                </td>

                <td className="px-5 py-3">{tx.category}</td>

                <td className="px-5 py-3">
                  <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                    {tx.type}
                  </span>
                </td>

                <td className="px-5 py-3 text-right font-semibold">
                  ${Math.abs(tx.amount)}
                </td>

                {/* 🔥 DELETE BUTTON */}
                {role === 'admin' && (
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete this transaction?")) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                )}

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </div>
  );
}