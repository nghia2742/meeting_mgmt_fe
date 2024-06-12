import { DataTable } from "@/components/data-table"
import { columns } from "./column"
import { Attendee } from "@/types/attendee.type"

interface AttendeesProps {
    attendees: Attendee[];
    meetingId: string;
    refreshData: () => void;
    canHaveActions: boolean;
}

export const AttendeeList: React.FC<AttendeesProps> = ({ refreshData, meetingId, attendees: initialAttendees, canHaveActions }) => {
    return (
        <DataTable columns={columns(meetingId, refreshData, canHaveActions)} data={initialAttendees ? initialAttendees : []}/>
    )
}