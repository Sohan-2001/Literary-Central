'use server';

import { get, ref, remove, set, update } from 'firebase/database';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { database } from '@/firebase/server';
import type { Book } from '@/lib/types';

const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authorId: z.string().min(1, 'Author is required'),
  isbn: z.string().min(1, 'ISBN is required'),
  publishedDate: z.string().min(1, 'Publication date is required'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().url('Invalid URL'),
  status: z.enum(['available', 'borrowed']),
});

export type BookFormState = {
  errors?: {
    title?: string[];
    authorId?: string[];
    isbn?: string[];
    publishedDate?: string[];
    description?: string[];
    coverImage?: string[];
    status?: string[];
  };
  message?: string;
};

export async function saveBook(
  prevState: BookFormState,
  formData: FormData
): Promise<BookFormState> {
  const validatedFields = bookSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.data) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Failed to save book. Please check the fields.',
    };
  }
  
  const { id, ...bookData } = validatedFields.data;

  try {
    if (id) {
      // Update existing book
      const bookRef = ref(database, `books/${id}`);
      await update(bookRef, bookData);
    } else {
      // Create new book
      const newBookId =
        'book' + new Date().getTime() + Math.floor(Math.random() * 1000);
      const bookRef = ref(database, `books/${newBookId}`);
      await set(bookRef, bookData);
    }
  } catch (e: any) {
    return { message: `Database Error: ${e.message}` };
  }

  revalidatePath('/books');
  return { message: 'Book saved successfully.' };
}


export async function deleteBook(bookId: string): Promise<{ message: string; }> {
  try {
    const borrowedRecordsRef = ref(database, 'borrowedRecords');
    const snapshot = await get(borrowedRecordsRef);
    if (snapshot.exists()) {
      const records = snapshot.val();
      const isBorrowed = Object.values(records).some((record: any) => record.bookId === bookId && record.returnedDate === null);
      if (isBorrowed) {
        return { message: 'Cannot delete a book that is currently on loan.' };
      }
    }

    const bookRef = ref(database, `books/${bookId}`);
    await remove(bookRef);
    revalidatePath('/books');
    return { message: 'Book deleted successfully.' };
  } catch (e: any) {
    return { message: `Database Error: ${e.message}` };
  }
}
