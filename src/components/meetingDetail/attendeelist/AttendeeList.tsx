import { DataTable } from "@/components/data-table"
import { columns } from "./column"
import { Attendee } from "@/types/attendee.type"

const attendees: Attendee[] = [
    {
        id: "1",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png",
        email: "dat.doan.clv@gmail.com",
    },
    {
        id: "2",
        name: 'Nghia Ngo',
        avatar: "https://github.com/shadcn.png",
        email: "nghia.ngo.clv@gmail.com",
    },
]

export const AttendeeList = () => {
    return (
        <DataTable columns={columns} data={attendees}/>
    )
}