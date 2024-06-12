import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MeetingFile } from "@/types/meeting.file.type"
import apiClient from "@/lib/apiClient"
import { toast } from "@/components/ui/use-toast"
import { useCallback, useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export const columns: (meetingId: string, refreshData: () => void, currentUserId: string) => ColumnDef<MeetingFile>[] = (meetingId, refreshData, currentUserId) => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    File name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Owner
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        // cell: ({ row }) => {
        //     const file = row.original;
        //     const [name, setName] = useState('');
        //     const getUser = useCallback(async () => {
        //         const response = await apiClient.get(`/users/${file.createdBy}`);
        //         if (response) {
        //             setName(response.data.fullName);
        //         }
        //     }, [])

        //     useEffect(() => {
        //         getUser();
        //     }, [])

        //     return (
        //         <div className="flex space-x-4 items-center">
        //             <p>{name}</p>
        //         </div>
        //     )
        // }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const file = row.original;

            const onDeleteFile = async () => {
                try {
                    let response = await apiClient.delete(`/files/${file.id}`);
                    if (response) {
                        toast({
                            title: "Successfully",
                            description: "Delete file successfully",
                            variant: "success",
                        });
                        refreshData();
                    }
                } catch (error: any) {
                    console.log(error);
                    toast({
                        title: "Failed",
                        description: error.response.data.message,
                        variant: "destructive",
                    });
                }
            }

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
                        <DropdownMenuItem><a className="w-full" href={file.link} target="_blank" rel="noopener noreferrer">View</a></DropdownMenuItem>
                        {file.createdBy === currentUserId && <DropdownMenuItem><p className="text-red-500" onClick={onDeleteFile}>Delete</p></DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

