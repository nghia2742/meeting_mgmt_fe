import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Meeting } from '@/types/meeting.type';
import Link from 'next/link';
import { compareDate, formatDateTime } from '@/utils/datetime.util';
import { Separator } from '@/components/ui/separator';

export const columns: ColumnDef<Meeting>[] = [
    {
        id: 'order',
        header: ({ column }) => {
            return (
                <div
                    className="flex cursor-pointer"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    #
                </div>
            );
        },
        cell: ({ row }) => (
            <span className="text-center">{Number(row.id) + 1}</span>
        ),
    },
    {
        accessorKey: 'title',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            return (
                <Link href={`/meeting/${row.original.id}`}>
                    {row.getValue('title')}
                </Link>
            );
        },
    },
    {
        accessorKey: 'tag',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Tag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const { formattedDate } = formatDateTime(row.getValue('startTime'));
            const dateComparison = compareDate(formattedDate);
            
            switch (dateComparison) {
                case -1:
                    return <div className='border border-destructive p-1 rounded-lg text-center text-destructive'>Close</div>
                case 0:
                    return <div className='border border-sky-500 p-1 rounded-lg text-center text-sky-500'>Today</div>
                case 1:
                    return <div className='border border-green-500 p-1 rounded-lg text-center text-green-500'>Upcoming</div>
            }
            
        },
        filterFn: (row, columnId, filterValue) => {
            const { formattedDate } = formatDateTime(row.getValue('startTime'));
            const dateComparison = compareDate(formattedDate);
            return dateComparison.toString() === filterValue;
        }
    },
    {
        accessorKey: 'startTime',
        header: 'Start time',
        cell: ({ row }) => {
            const { formattedDate, formattedTime } = formatDateTime(
                row.getValue('startTime')
            );
            return (
                <div className="flex">
                    {formattedDate}
                    <Separator
                        orientation="vertical"
                        className="h-6 mx-2 border-l border-gray-300"
                    />
                    {formattedTime}
                </div>
            );
        },
    },
    {
        accessorKey: 'endTime',
        header: 'End time',
        cell: ({ row }) => {
            const { formattedDate, formattedTime } = formatDateTime(
                row.getValue('endTime')
            );
            return (
                <div className="flex">
                    {formattedDate}
                    <Separator
                        orientation="vertical"
                        className="h-6 mx-2 border-l border-gray-300"
                    />
                    {formattedTime}
                </div>
            );
        },
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const meeting = row.original;

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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href={`/meeting/${row.original.id}`}>
                                View
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
