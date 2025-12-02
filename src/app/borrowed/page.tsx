'use client';
import { useList } from "@/firebase";
import { Book, User, BorrowedRecord, PopulatedBorrowedRecord } from "@/lib/types";
import { BorrowedClientPage } from "./_components/borrowed-client-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function BorrowedPage() {
  const { data: borrowedRecords, isLoading: borrowedLoading } = useList<BorrowedRecord>('borrowedRecords');
  const { data: books, isLoading: booksLoading } = useList<Book>('books');
  const { data: users, isLoading: usersLoading } = useList<User>('users');
  const { data: authors, isLoading: authorsLoading } = useList<Author>('authors');


  if (borrowedLoading || booksLoading || usersLoading || authorsLoading) {
    return (
       <div className="flex flex-col gap-6">
        <header>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-80 mt-2" />
        </header>
        <Skeleton className="w-full h-[400px]" />
      </div>
    )
  }

  const populatedBorrowedRecords: PopulatedBorrowedRecord[] = (borrowedRecords || [])
    .map(record => {
        const book = (books || []).find(b => b.id === record.bookId);
        const user = (users || []).find(u => u.id === record.userId);
        const author = (authors || []).find(a => a.id === book?.authorId);

        if (!book || !user || !author) {
            return null;
        }

        return {
            id: record.id,
            bookTitle: book.title,
            authorName: author.name,
            userName: user.name,
            borrowedDate: record.borrowedDate,
            dueDate: record.dueDate,
            status: record.returnedDate ? 'Returned' : 'On Loan',
        };
    })
    .filter((record): record is PopulatedBorrowedRecord => record !== null)
    .filter(record => record.status === 'On Loan');

  return <BorrowedClientPage borrowedBooks={populatedBorrowedRecords} />;
}

import type { Author } from "@/lib/types";