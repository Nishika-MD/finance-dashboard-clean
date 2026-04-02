export type Category = 
  | "Housing" 
  | "Food" 
  | "Transport" 
  | "Entertainment" 
  | "Healthcare" 
  | "Shopping" 
  | "Utilities" 
  | "Income" 
  | "Freelance" 
  | "Investment";

export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: Category;
  type: TransactionType;
}

export const mockTransactions: Transaction[] = [
  { id: "1", date: "2026-01-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "2", date: "2026-01-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "3", date: "2026-01-08", description: "Grocery Store", amount: -127.5, category: "Food", type: "expense" },
  { id: "4", date: "2026-01-12", description: "Netflix", amount: -15.99, category: "Entertainment", type: "expense" },
  { id: "5", date: "2026-01-15", description: "Freelance Project", amount: 850, category: "Freelance", type: "income" },
  { id: "6", date: "2026-01-20", description: "Gas Station", amount: -68, category: "Transport", type: "expense" },
  { id: "7", date: "2026-01-25", description: "Gym Membership", amount: -45, category: "Healthcare", type: "expense" },
  { id: "8", date: "2026-02-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "9", date: "2026-02-03", description: "Electric Bill", amount: -110, category: "Utilities", type: "expense" },
  { id: "10", date: "2026-02-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "11", date: "2026-02-10", description: "Dinner Date", amount: -85, category: "Food", type: "expense" },
  { id: "12", date: "2026-02-14", description: "Spotify", amount: -14.99, category: "Entertainment", type: "expense" },
  { id: "13", date: "2026-02-18", description: "Pharmacy", amount: -32.4, category: "Healthcare", type: "expense" },
  { id: "14", date: "2026-02-22", description: "Online Shopping", amount: -145.2, category: "Shopping", type: "expense" },
  { id: "15", date: "2026-03-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "16", date: "2026-03-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "17", date: "2026-03-07", description: "Vanguard Deposit", amount: -500, category: "Investment", type: "expense" },
  { id: "18", date: "2026-03-12", description: "Concert Tickets", amount: -120, category: "Entertainment", type: "expense" },
  { id: "19", date: "2026-03-15", description: "Car Maintenance", amount: -350, category: "Transport", type: "expense" },
  { id: "20", date: "2026-03-20", description: "Grocery Store", amount: -142.3, category: "Food", type: "expense" },
  { id: "21", date: "2026-04-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "22", date: "2026-04-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "23", date: "2026-04-09", description: "Water Bill", amount: -45.5, category: "Utilities", type: "expense" },
  { id: "24", date: "2026-04-12", description: "Freelance Project", amount: 1200, category: "Freelance", type: "income" },
  { id: "25", date: "2026-04-18", description: "New Shoes", amount: -89.99, category: "Shopping", type: "expense" },
  { id: "26", date: "2026-04-22", description: "Dentist", amount: -25, category: "Healthcare", type: "expense" },
  { id: "27", date: "2026-05-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "28", date: "2026-05-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "29", date: "2026-05-10", description: "Mother's Day Gift", amount: -75, category: "Shopping", type: "expense" },
  { id: "30", date: "2026-05-15", description: "Flight Tickets", amount: -450, category: "Transport", type: "expense" },
  { id: "31", date: "2026-05-20", description: "Grocery Store", amount: -156.7, category: "Food", type: "expense" },
  { id: "32", date: "2026-06-01", description: "Rent", amount: -2200, category: "Housing", type: "expense" },
  { id: "33", date: "2026-06-05", description: "Salary", amount: 5400, category: "Income", type: "income" },
  { id: "34", date: "2026-06-08", description: "Vanguard Deposit", amount: -500, category: "Investment", type: "expense" },
  { id: "35", date: "2026-06-12", description: "Coffee Shop", amount: -12.5, category: "Food", type: "expense" },
  { id: "36", date: "2026-06-18", description: "Gas Station", amount: -55, category: "Transport", type: "expense" },
  { id: "37", date: "2026-06-25", description: "Movie Theater", amount: -32, category: "Entertainment", type: "expense" },
  { id: "38", date: "2026-06-28", description: "Internet Bill", amount: -79.99, category: "Utilities", type: "expense" }
];
