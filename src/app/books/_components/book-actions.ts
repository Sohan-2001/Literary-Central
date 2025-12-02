'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

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
  success?: boolean;
};

// This function is now a placeholder as the logic is moved to the client.
// It will still be called by the form, but the client-side logic will handle the database operations.
export async function saveBookAction(
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
      success: false,
    };
  }

  // We are not performing the database operation here anymore.
  // Instead, we revalidate the path and return a success message.
  // The actual database call is now handled on the client in book-form.tsx.

  revalidatePath('/books');
  return { message: 'Book saved successfully.', success: true };
}
