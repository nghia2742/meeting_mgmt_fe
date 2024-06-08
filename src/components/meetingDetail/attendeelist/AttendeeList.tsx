import { DataTable } from "@/components/data-table"
import { columns } from "./column"
import { Attendee } from "@/types/attendee.type"

const attendees: Attendee[] = [
    {
        id: "1",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "2",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "3",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "4",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "5",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
]

export const AttendeeList = () => {
    return (
        <DataTable columns={columns} data={attendees}/>
    )
}