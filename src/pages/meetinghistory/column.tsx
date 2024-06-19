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
import { MeetingMinutesRes } from "@/types/meeting-minutes.type"
import apiClient from "@/lib/apiClient"
import { toast } from "@/components/ui/use-toast"
import { formatDateTime } from "@/utils/datetime.util"
import { Separator } from "@/components/ui/separator"

export const columns: (refreshData: () => void, currentUserId: string) => ColumnDef<MeetingMinutesRes>[] = (refreshData, currentUserId) => [
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant='ghost'
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created at
                    <ArrowUpDown className='ml-2 h-4 w-4' />
                </Button>
            );
        },
        cell: ({ row }) => {
            const meetingMinute = row.original;
            const { formattedDate, formattedTime } = formatDateTime(meetingMinute.createdAt.toString());

            return (
                <div className='flex'>
                    {formattedDate}
                    <Separator
                        orientation='vertical'
                        className='h-6 mx-2 border-l border-gray-300'
                    />
                    {formattedTime}
                </div>
            );
        },
    },
    {
        accessorKey: "meetingTitle",
        header: "Meeting",
    },
    {
        accessorKey: "userCreateName",
        header: "Created by",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const meetingMinute = row.original;

            const onDeleteMeetingMinute = async () => {
                try {
                    let responseDelCloudinary = await apiClient.delete(`/cloudinary?publicId=${meetingMinute.publicId}&type=pdf`);
                    if(responseDelCloudinary && responseDelCloudinary.data.result === 'ok') {
                        let responseDelFile = await apiClient.delete(`/meetingminutes/${meetingMinute.id}`);
                        if(responseDelFile) {
                            toast({
                                title: "Successfully",
                                description: "Delete file successfully",
                                variant: "success",
                            });
                            refreshData();
                        }
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
                        <DropdownMenuItem><a className="w-full" href={meetingMinute.link} target="_blank" rel="noopener noreferrer">View</a></DropdownMenuItem>
                        {meetingMinute.createdBy === currentUserId && <DropdownMenuItem><p onClick={onDeleteMeetingMinute} className="text-red-500">Delete</p></DropdownMenuItem>}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

