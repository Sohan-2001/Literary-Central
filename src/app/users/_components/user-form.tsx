'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';
import { useDatabase } from '@/firebase';
import { ref, set, update } from 'firebase/database';

const userFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  memberSince: z.string().min(1, 'Member since date is required'),
});

type UserFormValues = z.infer<typeof userFormSchema>;

interface UserFormProps {
  user?: User;
  onSuccess?: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { toast } = useToast();
  const database = useDatabase();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: user
      ? { ...user, memberSince: user.memberSince.split('T')[0] }
      : {
          name: '',
          email: '',
          memberSince: format(new Date(), 'yyyy-MM-dd'),
        },
  });

  const handleClientSubmit = async (data: UserFormValues) => {
    try {
      if (user?.id) {
        const userRef = ref(database, `users/${user.id}`);
        await update(userRef, data);
        toast({
          title: 'Success',
          description: 'User updated successfully.',
        });
      } else {
        const newUserId = 'user' + new Date().getTime() + Math.floor(Math.random() * 1000);
        const userRef = ref(database, `users/${newUserId}`);
        await set(userRef, { ...data, id: newUserId });
        toast({
          title: 'Success',
          description: 'User created successfully.',
        });
      }

      onSuccess?.();
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: e.message || 'Could not save user.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClientSubmit)} className="space-y-4">
        {user && <input type="hidden" {...form.register('id')} value={user.id} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane.doe@example.com" {...field} disabled={!!user} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="memberSince"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Since</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {user ? 'Save Changes' : 'Create User'}
        </Button>
      </form>
    </Form>
  );
}
