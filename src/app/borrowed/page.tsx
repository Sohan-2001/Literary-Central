'use client';
import { useList, useUser } from "@/firebase";
import { Book, User, BorrowedRecord, PopulatedBorrowedRecord } from "@/lib/types";
import { BorrowedClientPage } from "./_components/borrowed-client-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function BorrowedPage() {
  const { user: authUser } = useUser();
  const { data: borrowedRecords, isLoading: borrowedLoading } = useList<BorrowedRecord>(authUser ? `${authUser.uid}/borrowedRecords` : null);
  const { data: books, isLoading: booksLoading } = useList<Book>(authUser ? `${authUser.uid}/books` : null);
  const { data: users, isLoading: usersLoading } = useList<User>(authUser ? `${authUser.uid}/users` : null);
  
  if (borrowedLoading || booksLoading || usersLoading) {
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

        if (!book || !user) {
            return null;
        }

        return {
            id: record.id,
            bookId: book.id,
            userId: user.id,
            bookTitle: book.title,
            authorName: 'Unknown', // This would require another join with authors
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
