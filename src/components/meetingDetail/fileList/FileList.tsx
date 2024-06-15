import { DataTable } from '@/components/data-table'
import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'

interface Props {
    files: MeetingFile[],
    meetingId: string,
    refreshData: () => void,
    currentUserId: string | undefined,
    isLoading: boolean
}

const FileList = ({files, meetingId, refreshData, currentUserId, isLoading}: Props) => {
    return (
        <DataTable isLoading={isLoading} columns={columns(meetingId, refreshData, currentUserId || '')} data={files}/>
    )
}

export default FileList