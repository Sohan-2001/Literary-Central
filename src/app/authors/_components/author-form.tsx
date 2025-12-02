'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Author } from '@/lib/types';
import { useDatabase } from '@/firebase';
import { ref, set, update } from 'firebase/database';

const authorFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  bio: z.string().min(1, 'Bio is required'),
  birthDate: z.string().min(1, 'Birth date is required'),
});

type AuthorFormValues = z.infer<typeof authorFormSchema>;

interface AuthorFormProps {
  author?: Author;
  onSuccess?: () => void;
}

export function AuthorForm({ author, onSuccess }: AuthorFormProps) {
  const { toast } = useToast();
  const database = useDatabase();

  const form = useForm<AuthorFormValues>({
    resolver: zodResolver(authorFormSchema),
    defaultValues: author
      ? { ...author, birthDate: author.birthDate.split('T')[0] }
      : {
          name: '',
          bio: '',
          birthDate: '',
        },
  });

  const handleClientSubmit = async (data: AuthorFormValues) => {
    try {
      if (author?.id) {
        // Update existing author
        const authorRef = ref(database, `authors/${author.id}`);
        await update(authorRef, data);
        toast({
          title: 'Success',
          description: 'Author updated successfully.',
        });
      } else {
        // Create new author
        const newAuthorId = 'author' + new Date().getTime() + Math.floor(Math.random() * 1000);
        const authorRef = ref(database, `authors/${newAuthorId}`);
        await set(authorRef, { ...data, id: newAuthorId });
        toast({
          title: 'Success',
          description: 'Author created successfully.',
        });
      }
      onSuccess?.();
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Database Error',
        description: e.message || 'Could not save author.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleClientSubmit)} className="space-y-4">
        {author && <input type="hidden" {...form.register('id')} value={author.id} />}

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="J.K. Rowling" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="A short biography of the author..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {author ? 'Save Changes' : 'Create Author'}
        </Button>
      </form>
    </Form>
  );
}
