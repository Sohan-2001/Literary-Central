'use client';

import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Author, Book } from '@/lib/types';
import { saveBook, type BookFormState } from '../_components/book-actions';

const bookFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authorId: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publishedDate: z.string().min(1, 'Publication date is required'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().url('Invalid URL'),
  status: z.enum(['available', 'borrowed']),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  book?: Book;
  authors: Author[];
  onSuccess?: () => void;
}

const initialState: BookFormState = {};

export function BookForm({ book, authors, onSuccess }: BookFormProps) {
  const [state, formAction] = useFormState(saveBook, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: book
      ? { ...book, publishedDate: book.publishedDate.split('T')[0] }
      : {
          title: '',
          authorId: '',
          isbn: '',
          publishedDate: '',
          description: '',
          coverImage: 'https://picsum.photos/seed/6/400/600',
          status: 'available',
        },
  });

  useEffect(() => {
    if (state.message) {
      if (state.errors) {
        toast({
          variant: 'destructive',
          title: 'Error saving book',
          description: state.message,
        });
      } else {
        toast({
          title: 'Success',
          description: state.message,
        });
        onSuccess?.();
        form.reset();
        formRef.current?.reset();
      }
    }
  }, [state, toast, onSuccess, form]);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-4"
      >
        {book && <input type="hidden" name="id" value={book.id} />}
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="The Great Gatsby" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="authorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an author" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={author.id}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isbn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISBN</FormLabel>
              <FormControl>
                <Input placeholder="978-0743273565" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="publishedDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A novel about the American dream..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/cover.jpg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" name="status" value={book?.status || 'available'} />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {book ? 'Save Changes' : 'Create Book'}
        </Button>
      </form>
    </Form>
  );
}
