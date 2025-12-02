import { users } from "@/lib/data";
import { UserClientPage } from "./_components/user-client-page";

export default async function UsersPage() {
  return <UserClientPage users={users} />;
}
