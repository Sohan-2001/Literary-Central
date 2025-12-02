import { Author, Book, User, BorrowedRecord, PopulatedBook, PopulatedBorrowedRecord } from './types';
import { PlaceHolderImages } from './placeholder-images';

export const authors: Author[] = [
  { id: '1', name: 'George Orwell', bio: 'English novelist, essayist, journalist and critic.', birthDate: '1903-06-25' },
  { id: '2', name: 'Jane Austen', bio: 'English novelist known for her romantic fiction.', birthDate: '1775-12-16' },
  { id: '3', name: 'J.R.R. Tolkien', bio: 'English writer, poet, philologist, and academic.', birthDate: '1892-01-03' },
  { id: '4', name: 'Agatha Christie', bio: 'English writer known for her detective novels.', birthDate: '1890-09-15' },
];

export const books: Book[] = [
  { id: '1', title: '1984', authorId: '1', isbn: '978-0451524935', publishedDate: '1949-06-08', description: 'A dystopian social science fiction novel and cautionary tale.', coverImage: PlaceHolderImages[0].imageUrl, status: 'borrowed' },
  { id: '2', title: 'Pride and Prejudice', authorId: '2', isbn: '978-1503290563', publishedDate: '1813-01-28', description: 'A romantic novel of manners.', coverImage: PlaceHolderImages[1].imageUrl, status: 'available' },
  { id: '3', title: 'The Hobbit', authorId: '3', isbn: '978-0345339683', publishedDate: '1937-09-21', description: 'A children\'s fantasy novel.', coverImage: PlaceHolderImages[2].imageUrl, status: 'available' },
  { id: '4', title: 'Animal Farm', authorId: '1', isbn: '978-0451526342', publishedDate: '1945-08-17', description: 'A beast fable, in the form of a satirical allegorical novella.', coverImage: PlaceHolderImages[3].imageUrl, status: 'available' },
  { id: '5', title: 'Sense and Sensibility', authorId: '2', isbn: '978-15032905 Sense', publishedDate: '1811-10-30', description: 'A novel by Jane Austen.', coverImage: PlaceHolderImages[4].imageUrl, status: 'borrowed' },
  { id: '6', title: 'The Lord of the Rings', authorId: '3', isbn: '978-0618640157', publishedDate: '1954-07-29', description: 'An epic high-fantasy novel.', coverImage: PlaceHolderImages[5].imageUrl, status: 'available' },
  { id: '7', title: 'And Then There Were None', authorId: '4', isbn: '978-0312330873', publishedDate: '1939-11-06', description: 'A mystery novel.', coverImage: PlaceHolderImages[0].imageUrl, status: 'borrowed' },
];

export const users: User[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', memberSince: '2023-01-15' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', memberSince: '2023-03-22' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', memberSince: '2023-05-30' },
];

export const borrowedRecords: BorrowedRecord[] = [
  { id: '1', bookId: '1', userId: '1', borrowedDate: '2024-05-01', dueDate: '2024-05-22', returnedDate: null },
  { id: '2', bookId: '5', userId: '2', borrowedDate: '2024-05-10', dueDate: '2024-05-31', returnedDate: null },
  { id: '3', bookId: '2', userId: '1', borrowedDate: '2024-04-15', dueDate: '2024-05-06', returnedDate: '2024-05-05' },
  { id: '4', bookId: '7', userId: '3', borrowedDate: '2024-05-18', dueDate: '2024-06-08', returnedDate: null },
];

export function getPopulatedBooks(books: Book[], authors: Author[]): PopulatedBook[] {
    return books.map(book => {
        const author = authors.find(a => a.id === book.authorId);
        if (!author) {
            // In a real app, you might want to handle this more gracefully
            console.warn(`Author not found for book with ID ${book.id}`);
            return {
                ...book,
                author: {id: 'unknown', name: 'Unknown Author', bio: '', birthDate: ''}
            };
        }
        return {
            ...book,
            author,
        };
    });
}

export function getPopulatedBorrowedRecords(borrowedRecords: BorrowedRecord[], books: Book[], users: User[], authors: Author[]): PopulatedBorrowedRecord[] {
    return borrowedRecords.map(record => {
        const book = books.find(b => b.id === record.bookId);
        const user = users.find(u => u.id === record.userId);
        const author = authors.find(a => a.id === book?.authorId);

        if (!book || !user || !author) {
            console.warn(`Data mismatch for record ${record.id}`);
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
    }).filter((record): record is PopulatedBorrowedRecord => record !== null);
}
