import { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Transaction } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Trash2 } from 'lucide-react';
import { TransactionForm } from './TransactionForm';

type SortKey = keyof Transaction;
type SortDir = 'asc' | 'desc';

export function TransactionTable() {
  const {
    filteredTransactions,
    filters,
    setFilters,
    role,
    deleteTransaction
  } = useAppContext();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const sorted = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [filteredTransactions]);

  return (
    <div className="space-y-5">

      {/* FILTER */}
      <div className="relative rounded-2xl p-4 bg-white border border-blue-100 shadow-md dark:bg-white/5 dark:border-white/10">
        <div className="flex gap-3 items-center flex-wrap">

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input
              placeholder="Search transactions..."
              value={filters.search}
              onChange={e => setFilters({ ...filters, search: e.target.value })}
              className="pl-8 h-10 w-full bg-blue-50 border border-blue-200"
            />
          </div>

          {role === 'admin' && (
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-500 text-white w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </div>

      {/* 🔥 MOBILE CARDS */}
      <div className="block sm:hidden space-y-3">
        {sorted.map(tx => (
          <div key={tx.id} className="p-4 rounded-xl border bg-white shadow-sm dark:bg-[#0b0f1a]">

            <div className="flex justify-between">
              <p className="font-semibold">{tx.description}</p>
              <p className="text-sm">
                {format(parseISO(tx.date), 'MMM d')}
              </p>
            </div>

            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>{tx.category}</span>
              <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                {tx.type}
              </span>
            </div>

            <div className="flex justify-between mt-2">
              <span className="font-bold">${Math.abs(tx.amount)}</span>

              {role === 'admin' && (
                <button
                  onClick={() => {
                    if (confirm("Delete this transaction?")) {
                      deleteTransaction(tx.id);
                    }
                  }}
                  className="text-red-500"
                >
                  Delete
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* 💻 DESKTOP TABLE */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl bg-white border shadow-md dark:bg-[#0b0f1a]/80">

        <table className="min-w-[700px] w-full text-sm">

          <thead className="bg-blue-50 border-b dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 text-left">date</th>
              <th className="px-4 py-3 text-left">description</th>
              <th className="px-4 py-3 text-left">category</th>
              <th className="px-4 py-3 text-left">type</th>
              <th className="px-4 py-3 text-right">amount</th>
              {role === 'admin' && <th className="px-4 py-3 text-right">Action</th>}
            </tr>
          </thead>

          <tbody>
            {sorted.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-blue-50 dark:hover:bg-white/5">

                <td className="px-4 py-3">
                  {format(parseISO(tx.date), 'MMM d')}
                </td>

                <td className="px-4 py-3 font-medium">{tx.description}</td>

                <td className="px-4 py-3">{tx.category}</td>

                <td className="px-4 py-3">
                  <span className={tx.type === 'income' ? 'text-green-600' : 'text-red-500'}>
                    {tx.type}
                  </span>
                </td>

                <td className="px-4 py-3 text-right font-semibold">
                  ${Math.abs(tx.amount)}
                </td>

                {role === 'admin' && (
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        if (confirm("Delete this transaction?")) {
                          deleteTransaction(tx.id);
                        }
                      }}
                      className="text-red-500"
                    >
                      Delete
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