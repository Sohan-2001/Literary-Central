export type Author = {
  id: string;
  name: string;
  bio: string;
  birthDate: string;
};

export type Book = {
  id: string;
  title: string;
  authorId: string;
  isbn: string;
  publishedDate: string;
  description: string;
  coverImage: string;
  status: 'available' | 'borrowed';
};

export type User = {
  id: string;
  name: string;
  email: string;
  memberSince: string;
};

export type BorrowedRecord = {
  id: string;
  bookId: string;
  userId: string;
  borrowedDate: string;
  dueDate: string;
  returnedDate: string | null;
};

export type PopulatedBook = Omit<Book, 'authorId'> & { author: Author };
export type PopulatedBorrowedRecord = {
  id: string;
  bookTitle: string;
  authorName: string;
  userName: string;
  borrowedDate: string;
  dueDate: string;
  status: 'On Loan' | 'Returned';
};

export type UserWithBorrows = User & {
  borrowHistory: PopulatedBorrowedRecord[];
};
