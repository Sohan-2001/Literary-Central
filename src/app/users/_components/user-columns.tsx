"use client";

import type { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useDatabase, useUser as useAuthUser } from "@/firebase";
import { ref, remove } from "firebase/database";
import { UserForm } from "./user-form";

function ActionsCell({ user }: { user: User }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const database = useDatabase();
  const { user: authUser } = useAuthUser();

  const handleDelete = async () => {
    if (!authUser) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to delete a user.",
      });
      return;
    }
    try {
      const userRef = ref(database, `${authUser.uid}/users/${user.id}`);
      await remove(userRef);
      toast({
        title: "Success",
        description: "User deleted successfully.",
      });
    } catch (e: any) {
      toast({
        variant: "destructive",
        title: "Error deleting user",
        description: e.message || "An unknown error occurred.",
      });
    }
  };

  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
               <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setIsEditDialogOpen(true);
                }}
              >
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem disabled>View Borrowing History</DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  Delete User
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the user &quot;{user.name}&quot;. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit &quot;{user.name}&quot;</DialogTitle>
          </DialogHeader>
          <UserForm
            user={user}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}


export const getUserColumns = (): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "memberSince",
    header: "Member Since",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;
      return <ActionsCell user={user} />;
    },
  },
];
