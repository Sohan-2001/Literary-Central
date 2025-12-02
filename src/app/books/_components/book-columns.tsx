'use client';

import type { Author, PopulatedBook, User } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
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
import Image from "next/image";
import React from "react";
import { BookForm } from "./book-form";
import { useToast } from "@/hooks/use-toast";
import { useDatabase, useUser } from "@/firebase";
import { ref, remove } from "firebase/database";
import { BorrowForm } from "./borrow-form";

function ActionsCell({
  book,
  authors,
  users,
}: {
  book: PopulatedBook;
  authors: Author[];
  users: User[];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isBorrowDialogOpen, setIsBorrowDialogOpen] = React.useState(false);
  const { toast } = useToast();
  const database = useDatabase();
  const { user: authUser } = useUser();

  const handleDelete = async () => {
    if (!authUser) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: 'You must be logged in to delete a book.',
      });
      return;
    }
    if (book.status === 'borrowed') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Cannot delete a book that is currently on loan.',
      });
      return;
    }

    try {
      const bookRef = ref(database, `${authUser.uid}/books/${book.id}`);
      await remove(bookRef);
      toast({
        title: 'Success',
        description: 'Book deleted successfully.',
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Error deleting book',
        description: e.message || 'An unknown error occurred.',
      });
    }
  };


  return (
    <>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <Dialog open={isBorrowDialogOpen} onOpenChange={setIsBorrowDialogOpen}>
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
                  Edit Book
                </DropdownMenuItem>
                <DropdownMenuItem 
                  disabled={book.status === "borrowed"}
                  onSelect={(e) => {
                    e.preventDefault();
                    setIsBorrowDialogOpen(true);
                  }}
                >
                  Borrow Book
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem 
                    className="text-destructive" 
                    onSelect={(e) => e.preventDefault()}
                    disabled={book.status === 'borrowed'}
                  >
                    Delete Book
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the book &quot;{book.title}&quot;. This
                  action cannot be undone.
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
              <DialogTitle>Borrow &quot;{book.title}&quot;</DialogTitle>
            </DialogHeader>
            <BorrowForm
              book={book}
              users={users}
              onSuccess={() => setIsBorrowDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit &quot;{book.title}&quot;</DialogTitle>
          </DialogHeader>
          <BookForm
            book={book}
            authors={authors}
            onSuccess={() => setIsEditDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export const getBookColumns = (authors: Author[], users: User[]): ColumnDef<PopulatedBook>[] => [
  {
    accessorKey: "coverImage",
    header: "Cover",
    cell: ({ row }) => (
      <Image
        src={row.getValue("coverImage")}
        alt={row.original.title}
        width={40}
        height={60}
        className="rounded-sm"
        data-ai-hint="book cover"
      />
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "author",
    header: "Author",
    cell: ({ row }) => {
      const author = row.original.author;
      return <div>{author?.name || 'Unknown'}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status: "available" | "borrowed" = row.getValue("status");
      return (
        <Badge variant={status === "available" ? "secondary" : "outline"}>
          {status === "available" ? "Available" : "On Loan"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isbn",
    header: "ISBN",
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const book = row.original;
      return <ActionsCell book={book} authors={authors} users={users} />;
    },
  },
];
