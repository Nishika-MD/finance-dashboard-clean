import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '../context/AppContext';
import { Transaction, Category, TransactionType } from '../data/mockData';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog';

import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  description: z.string().min(1),
  amount: z.coerce.number().refine(val => val !== 0),
  category: z.string().min(1),
  type: z.enum(["income", "expense"]),
  date: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function TransactionForm({ isOpen, onClose, transaction }: any) {
  const { addTransaction, updateTransaction } = useAppContext();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      amount: 0,
      category: 'Housing',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (transaction && isOpen) {
      form.reset({
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        date: transaction.date,
      });
    }
  }, [transaction, isOpen]);

  const onSubmit = (values: FormValues) => {
    const amount = values.type === 'expense'
      ? -Math.abs(values.amount)
      : Math.abs(values.amount);

    const tx: Transaction = {
      id: transaction ? transaction.id : Math.random().toString(),
      ...values,
      amount,
      category: values.category as Category,
      type: values.type as TransactionType,
    };

    transaction ? updateTransaction(transaction.id, tx) : addTransaction(tx);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="
        sm:max-w-[420px]
        bg-white dark:bg-[#0b0f1a]
        border border-gray-200 dark:border-white/10
        shadow-xl
      ">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-white/70">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Amount + Date */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-white/70">
                      Amount
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        className="bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-white/70">
                      Date
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Type + Category */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-white/70">
                      Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-white/70">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Housing">Housing</SelectItem>
                        <SelectItem value="Food">Food</SelectItem>
                        <SelectItem value="Transport">Transport</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Shopping">Shopping</SelectItem>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Investment">Investment</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}
            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
                Save
              </Button>
            </DialogFooter>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}