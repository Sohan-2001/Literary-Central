'use client';

import { useList, useUser } from "@/firebase";
import { BookClientPage } from "./_components/book-client-page";
import { Book, Author, PopulatedBook, User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function BooksPage() {
  const { user } = useUser();
  const { data: books, isLoading: booksLoading } = useList<Book>(user ? `${user.uid}/books`: null);
  const { data: authors, isLoading: authorsLoading } = useList<Author>(user ? `${user.uid}/authors` : null);
  const { data: users, isLoading: usersLoading } = useList<User>(user ? `${user.uid}/users` : null);


  if (booksLoading || authorsLoading || usersLoading) {
    return (
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-72 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </header>
        <Skeleton className="w-full h-[400px]" />
      </div>
    )
  }

  const populatedBooks: PopulatedBook[] = (books || []).map(book => {
    const author = (authors || []).find(a => a.id === book.authorId);
    return {
      ...book,
      author: author || { id: book.authorId, name: "Unknown Author", bio: "", birthDate: "" },
    };
  });


  return <BookClientPage books={populatedBooks} authors={authors || []} users={users || []} />;
}
