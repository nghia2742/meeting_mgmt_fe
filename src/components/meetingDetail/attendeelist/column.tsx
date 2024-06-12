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
import { Attendee } from "@/types/attendee.type"
import apiClient from "@/lib/apiClient"
import { toast } from "@/components/ui/use-toast"

export const columns: (meetindId: string, refreshData: () => void) => ColumnDef<Attendee>[] = (meetingId, refreshData) => [
    {
        accessorKey: "id",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Id
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "fullName",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Fullname
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            const onDeleteAttendee = async() => {
                try {
                    let response = await apiClient.delete(`/usermeetings?userId=${user.id}&meetingId=${meetingId}`);
                    if(response) {
                        toast({
                            title: "Successfully",
                            description: "Delete attendee successfully",
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
                        <DropdownMenuItem><p className="text-red-500" onClick={onDeleteAttendee}>Delete</p></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

