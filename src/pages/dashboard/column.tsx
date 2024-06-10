"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Meeting } from "@/types/meeting.type";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export const dashboardColumns: ColumnDef<Meeting>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
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
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const user = row.original;
  //     const [isOpenDialog, setIsOpenDialog] = useState(false);

  //     const formUser = {
  //       ...user,
  //       projects: user.projects
  //         .toString()
  //         .split(",")
  //         .map((proj) => ({ name: proj })),
  //     };

  //     const { isPending: isUpdatingUser, mutate: updateUser } = useUpdateUser();
  //     const { isPending: isDeletingUser, mutate: deleteUser } = useDeleteUser();

  //     const handleSubmitForm = (u: User) => {
  //       updateUser(u);
  //       setIsOpenDialog(false);
  //     };

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant='ghost' className='h-8 w-8 p-0'>
  //             <span className='sr-only'>Open menu</span>
  //             <MoreHorizontal className='h-4 w-4' />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align='end'>
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <Dialog
  //             open={isOpenDialog}
  //             onOpenChange={(isOpen) => setIsOpenDialog(isOpen)}
  //           >
  //             <DialogTrigger className='w-full'>
  //               <DropdownMenuItem
  //                 className='hover:cursor-pointer'
  //                 onSelect={(e) => e.preventDefault()}
  //                 onClick={() => setIsOpenDialog(true)}
  //               >
  //                 Edit User
  //               </DropdownMenuItem>
  //             </DialogTrigger>
  //             <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-[425px]'>
  //               <DialogHeader>
  //                 <DialogTitle>Edit User</DialogTitle>
  //                 <DialogDescription>
  //                   Make changes to user profile here. Click save when you're
  //                   done.
  //                 </DialogDescription>
  //               </DialogHeader>
  //               <FormDialog
  //                 isEditing
  //                 defaultValues={formUser}
  //                 submitFn={handleSubmitForm}
  //               />
  //             </DialogContent>
  //           </Dialog>
  //           <DropdownMenuSeparator />
  //           <AlertDialog>
  //             <AlertDialogTrigger asChild>
  //               <DropdownMenuItem
  //                 className='hover:cursor-pointer'
  //                 onSelect={(e) => e.preventDefault()}
  //               >
  //                 Delete User
  //               </DropdownMenuItem>
  //             </AlertDialogTrigger>
  //             <ConfirmDialog handleConfirm={() => deleteUser(user.username)} />
  //           </AlertDialog>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
