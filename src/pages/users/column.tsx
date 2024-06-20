import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/userProfile.type";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/utils/datetime.util";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const getColumns = (handleEditClick: (user: UserProfile) => void, handleDeleteClick: (user: UserProfile) => void): ColumnDef<UserProfile>[] => [
    {
        accessorKey: "fullName",
        header: "Full Name",
        enableSorting: true, // Enable sorting for this column
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "dateOfBirth",
        header: "Date of Birth",
        cell: ({ row }) => {
            const { formattedDate } = formatDateTime(row.getValue("dateOfBirth"));
            return formattedDate;
        }
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <Avatar className="w-8 h-8">
                <AvatarImage className="w-8 h-8 rounded-full object-cover" src={row.getValue("avatar") || "/images/logoCLT.png" }/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditClick(row.original)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteClick(row.original)}>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
