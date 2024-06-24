"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
// import { Checkbox } from "@/components/ui/checkbox";
import { Meeting } from "@/types/meeting.type";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { isFutureDate } from "@/utils/time-picker.util";
import { compareDate } from "@/utils/datetime.util";

export const dashboardColumns: ColumnDef<Meeting>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "tag",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tag
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const startTime = row.original.startTime;
      const dateComparison = compareDate(new Date(startTime).toISOString());
      switch (dateComparison) {
        case -1:
          return (
            <div className='border border-destructive p-1 rounded-lg text-center text-destructive'>
              Close
            </div>
          );
        case 1:
          return (
            <div className='border border-green-500 p-1 rounded-lg text-center text-green-500'>
              Upcoming
            </div>
          );
      }
    },
    filterFn: (row, columnId, filterValue) => {
      const dateComparison = compareDate(row.getValue("start"));
      return dateComparison.toString() === filterValue;
    },
  },
  {
    accessorKey: "start",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Start
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const meeting = row.original;
      const formattedDatetime = format(meeting.startTime, "yyyy-MM-dd HH:mm");
      const separatedDateAndTime = formattedDatetime.split(" ");

      return (
        <div className='flex'>
          {separatedDateAndTime[0]}
          <Separator
            orientation='vertical'
            className='h-6 mx-2 border-l border-gray-300'
          />
          {separatedDateAndTime[1]}
        </div>
      );
    },
    filterFn: (row) => {
      const date = row.original.startTime;
      return isFutureDate(date);
    },
  },
  {
    accessorKey: "end",
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          End
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const meeting = row.original;
      const formattedDatetime = format(meeting.endTime, "yyyy-MM-dd HH:mm");
      const separatedDateAndTime = formattedDatetime.split(" ");

      return (
        <div className='flex'>
          {separatedDateAndTime[0]}
          <Separator
            orientation='vertical'
            className='h-6 mx-2 border-l border-gray-300'
          />
          {separatedDateAndTime[1]}
        </div>
      );
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
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href={`/meeting/${meeting.id}`}>View Meeting Details</Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem>Update</DropdownMenuItem>
            <DropdownMenuItem>
              <p className='text-red-500'>Delete</p>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
