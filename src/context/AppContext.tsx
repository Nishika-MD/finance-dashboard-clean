import React, { createContext, useContext, useState, useMemo,useEffect } from 'react';
import { Transaction, mockTransactions } from '../data/mockData';


export type Role = 'admin' | 'viewer';

interface FilterState {
  search: string;
  category: string;
  type: string;
  month: string;
}

interface AppContextType {
  transactions: Transaction[];
  addTransaction: (tx: Transaction) => void;
  updateTransaction: (id: string, tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  role: Role;
  setRole: (role: Role) => void;
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredTransactions: Transaction[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : mockTransactions;
});

useEffect(() => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}, [transactions]);
  const [role, setRole] = useState<Role>('admin');
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    type: 'all',
    month: 'all'
  });

  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
  };

  const updateTransaction = (id: string, updatedTx: Transaction) => {
    setTransactions(prev =>
      prev.map(tx => tx.id === id ? updatedTx : tx)
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev =>
      prev.filter(tx => tx.id !== id)
    );
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchSearch = tx.description.toLowerCase().includes(filters.search.toLowerCase());
      const matchCategory = filters.category === 'all' || tx.category === filters.category;
      const matchType = filters.type === 'all' || tx.type === filters.type;
      const matchMonth = filters.month === 'all' || tx.date.startsWith(filters.month);
      return matchSearch && matchCategory && matchType && matchMonth;
    });
  }, [transactions, filters]);

  return (
    <AppContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction, // ✅ important
      role,
      setRole,
      filters,
      setFilters,
      filteredTransactions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};