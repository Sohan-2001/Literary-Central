import { getPopulatedBorrowedRecords } from "@/lib/data";
import { BorrowedClientPage } from "./_components/borrowed-client-page";

export default async function BorrowedPage() {
  const borrowedBooks = getPopulatedBorrowedRecords().filter(
    (record) => record.status === "On Loan"
  );
  return <BorrowedClientPage borrowedBooks={borrowedBooks} />;
}
