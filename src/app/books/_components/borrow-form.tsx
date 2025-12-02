'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, add } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Book, User } from '@/lib/types';
import { useDatabase, useUser } from '@/firebase';
import { ref, set, update, push } from 'firebase/database';

const borrowFormSchema = z.object({
  userId: z.string().min(1, 'User is required'),
});

type BorrowFormValues = z.infer<typeof borrowFormSchema>;

interface BorrowFormProps {
  book: Book;
  users: User[];
  onSuccess?: () => void;
}

export function BorrowForm({ book, users, onSuccess }: BorrowFormProps) {
  const { toast } = useToast();
  const database = useDatabase();
  const { user: authUser } = useUser();

  const form = useForm<BorrowFormValues>({
    resolver: zodResolver(borrowFormSchema),
    defaultValues: {
      userId: '',
    },
  });

  const handleClientSubmit = async (data: BorrowFormValues) => {
    if (!authUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to borrow a book.',
      });
      return;
    }
    try {
      const borrowedDate = new Date();
      const dueDate = add(borrowedDate, { weeks: 2 });
      
      const borrowRef = ref(database, `${authUser.uid}/borrowedRecords`);
      const newBorrowRef = push(borrowRef);
      
      const newRecord = {
          id: newBorrowRef.key,
          bookId: book.id,
          userId: data.userId,
          borrowedDate: format(borrowedDate, 'yyyy-MM-dd'),
          dueDate: format(dueDate, 'yyyy-MM-dd'),
          returnedDate: null,
      }

      await set(newBorrowRef, newRecord);

      const bookRef = ref(database, `${authUser.uid}/books/${book.id}`);
      await update(bookRef, { status: 'borrowed' });

      toast({
        title: 'Success',
        description: 'Book borrowed successfully.',
      });

      onSuccess?.();
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: e.message || 'Could not borrow book.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClientSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borrower</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user to borrow the book" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          Confirm Borrow
        </Button>
      </form>
    </Form>
  );
}
