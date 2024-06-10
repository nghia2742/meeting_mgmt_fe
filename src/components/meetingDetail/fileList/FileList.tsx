import { DataTable } from '@/components/data-table'
import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'
import files from '@/const/files'

const FileList = () => {
    return (
        <DataTable columns={columns} data={files}/>
    )
}

export default FileList