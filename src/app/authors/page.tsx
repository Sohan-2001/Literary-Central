'use client';
import { useList, useUser } from "@/firebase";
import { Author } from "@/lib/types";
import { AuthorClientPage } from "./_components/author-client-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuthorsPage() {
  const { user } = useUser();
  const { data: authors, isLoading } = useList<Author>(user ? `${user.uid}/authors` : null);

  if (isLoading) {
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

  return <AuthorClientPage authors={authors || []} />;
}
