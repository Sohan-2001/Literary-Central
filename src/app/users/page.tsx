'use client';
import { useList } from "@/firebase";
import { User } from "@/lib/types";
import { UserClientPage } from "./_components/user-client-page";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const { data: users, isLoading } = useList<User>('users');

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
    );
  }
  return <UserClientPage users={users || []} />;
}
