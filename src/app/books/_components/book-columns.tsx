"use client";

import type { PopulatedBook } from "@/lib/types";
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
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import Image from "next/image";

export const bookColumns: ColumnDef<PopulatedBook>[] = [
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
      return <div>{author.name}</div>;
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

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(book.id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit Book</DropdownMenuItem>
            <DropdownMenuItem
              disabled={book.status === 'borrowed'}
            >
              Borrow Book
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Delete Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
