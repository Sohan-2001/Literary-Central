import { getPopulatedBooks } from "@/lib/data";
import { BookClientPage } from "./_components/book-client-page";

export default async function BooksPage() {
  const books = getPopulatedBooks();

  return <BookClientPage books={books} />;
}
