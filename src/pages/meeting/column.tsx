import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Meeting } from "@/types/meeting.type"
import Link from "next/link"
import { formatDateTime } from "@/utils/datetime.util"

export const columns: ColumnDef<Meeting>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label  ="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
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
            )
        },
        cell: ({ row }) => {
            return (
                <Link href={`/meeting/${row.original.id}`}>{row.getValue('title')}</Link>
            );
        },
    },
    {
        accessorKey: "tag",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tag
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "startTime",
        header: "Start time",
        cell: ({ row }) => {
            const { formattedDate, formattedTime } = formatDateTime(row.getValue('startTime'))
            return formattedDate + ' ' + formattedTime;
        },
    },
    {
        accessorKey: "endTime",
        header: "End time",
        cell: ({ row }) => {
            const { formattedDate, formattedTime } = formatDateTime(row.getValue('endTime'))
            return formattedDate + ' ' + formattedTime;
        },
    },
    {
        accessorKey: "location",
        header: "Location",
    },
    {
        id: "actions",
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
                        <DropdownMenuItem>Update</DropdownMenuItem>
                        <DropdownMenuItem><p className="text-red-500">Delete</p></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

