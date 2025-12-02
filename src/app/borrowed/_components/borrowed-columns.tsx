'use client';

import type { PopulatedBorrowedRecord } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/alert-dialog';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useDatabase, useUser } from '@/firebase';
import { ref, update } from 'firebase/database';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

function ActionsCell({ record }: { record: PopulatedBorrowedRecord }) {
  const database = useDatabase();
  const { toast } = useToast();
  const { user: authUser } = useUser();

  const handleMarkAsReturned = async () => {
    if (!authUser) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to perform this action.',
        });
        return;
    }
    try {
      const updates: { [key: string]: any } = {};
      updates[`/${authUser.uid}/borrowedRecords/${record.id}/returnedDate`] = format(new Date(), 'yyyy-MM-dd');
      updates[`/${authUser.uid}/books/${record.bookId}/status`] = 'available';

      await update(ref(database), updates);

      toast({
        title: 'Success',
        description: 'Book marked as returned.',
      });
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: e.message || 'Could not mark book as returned.',
      });
    }
  };

  return (
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
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              Mark as Returned
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will mark the book &quot;{record.bookTitle}&quot; as returned.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleMarkAsReturned}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const borrowedColumns: ColumnDef<PopulatedBorrowedRecord>[] = [
  {
    accessorKey: 'bookTitle',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Book Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue('bookTitle')}</div>
    ),
  },
  {
    accessorKey: 'userName',
    header: 'Borrowed By',
  },
  {
    accessorKey: 'borrowedDate',
    header: 'Borrowed Date',
  },
  {
    accessorKey: 'dueDate',
    header: 'Due Date',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return <ActionsCell record={row.original} />;
    },
  },
];
