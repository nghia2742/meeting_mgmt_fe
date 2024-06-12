import { DataTable } from '@/components/data-table'
import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'

interface Props {
    files: MeetingFile[],
    meetingId: string,
    refreshData: () => void
}

const FileList = ({files, meetingId, refreshData}: Props) => {
    return (
        <DataTable columns={columns} data={files}/>
    )
}

export default FileList