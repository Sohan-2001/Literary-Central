import { authors } from "@/lib/data";
import { AuthorClientPage } from "./_components/author-client-page";

export default async function AuthorsPage() {
  return <AuthorClientPage authors={authors} />;
}
