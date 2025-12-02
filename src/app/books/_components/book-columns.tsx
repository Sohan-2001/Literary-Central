"use client";

import type { Author, PopulatedBook } from "@/lib/types";
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
  DialogTrigger,
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
import { deleteBook } from "./book-actions";
import { useToast } from "@/hooks/use-toast";

function ActionsCell({
  book,
  authors,
}: {
  book: PopulatedBook;
  authors: Author[];
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    const result = await deleteBook(book.id);
    if (result.message.startsWith('Database Error:')) {
      toast({
        variant: 'destructive',
        title: 'Error deleting book',
        description: result.message,
      });
    } else {
       toast({
        title: 'Success',
        description: result.message,
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
                Edit Book
              </DropdownMenuItem>
              <DropdownMenuItem disabled={book.status === "borrowed"}>
                Borrow Book
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
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

export const getBookColumns = (authors: Author[], onEdit: (bookId: string) => void): ColumnDef<PopulatedBook>[] => [
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
      return <ActionsCell book={book} authors={authors} />;
    },
  },
];
