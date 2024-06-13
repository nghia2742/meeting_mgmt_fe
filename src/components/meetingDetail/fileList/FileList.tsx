import { DataTable } from '@/components/data-table'
import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'

interface Props {
    files: MeetingFile[],
    meetingId: string,
    refreshData: () => void,
    currentUserId: string | undefined
}

const FileList = ({files, meetingId, refreshData, currentUserId}: Props) => {
    return (
        <DataTable columns={columns(meetingId, refreshData, currentUserId || '')} data={files}/>
    )
}

export default FileList