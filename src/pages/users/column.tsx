import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/types/userProfile.type';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDateTime } from '@/utils/datetime.util';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const getColumns = (
    handleEditClick: (user: UserProfile) => void,
    handleDeleteClick: (user: UserProfile) => void
): ColumnDef<UserProfile>[] => [
    {
        id: 'order',
        header: ({ column }) => {
            return <div>#</div>;
        },
        cell: ({ row }) => (
            <span className="text-center">{Number(row.id) + 1}</span>
        ),
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => (
            <Avatar className="w-8 h-8">
                <AvatarImage
                    className="w-8 h-8 rounded-full object-cover"
                    src={row.getValue('avatar') || '/images/logoCLT.png'}
                />
                <AvatarFallback>Avt</AvatarFallback>
            </Avatar>
        ),
    },
    {
        accessorKey: 'fullName',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === 'asc')
                    }
                >
                    Full name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'gender',
        header: 'Gender',
    },
    {
        accessorKey: 'dateOfBirth',
        header: 'Date of Birth',
        cell: ({ row }) => {
            const dateOfBirth = row.getValue('dateOfBirth') as string
            if (dateOfBirth) {
                const { formattedDate } = formatDateTime(
                    dateOfBirth
                );
                return formattedDate;
            }
        },
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },

    {
        id: 'actions',
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
                    <DropdownMenuItem
                        onClick={() => handleEditClick(row.original)}
                    >
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleDeleteClick(row.original)}
                    >
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
