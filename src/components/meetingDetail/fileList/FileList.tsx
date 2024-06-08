import { DataTable } from '@/components/data-table'
import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'

const files: MeetingFile[] = [
    {
        id: 1,
        name: 'file_kdumwh',
        link: 'https://res.cloudinary.com/dblglqzca/image/upload/v1717597868/file_kdumwh.pdf',
        type: 'pdf'
    },
    {
        id: 2,
        name: 'file_rfdag0',
        link: 'https://res.cloudinary.com/dblglqzca/image/upload/v1717401196/file_rfdag0.pdf',
        type: 'pdf'
    },
]

const FileList = () => {
    return (
        <DataTable columns={columns} data={files}/>
    )
}

export default FileList