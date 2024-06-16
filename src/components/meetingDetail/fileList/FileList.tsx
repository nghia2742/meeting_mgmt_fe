import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'
import { DataTable } from './data-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    files: MeetingFile[],
    meetingId: string,
    refreshData: () => void,
    currentUserId: string | undefined,
    isLoading: boolean
}

const FileList = ({ files, meetingId, refreshData, currentUserId, isLoading }: Props) => {

    const [typeFilter, setTypeFilter] = useState<string | null>(null);
    const filteredFiles = typeFilter ? files.filter(file => file.type === typeFilter) : files;

    const uniqueTypes = Array.from(new Set(files.map(file => file.type)));

    return (
        <div>
            <div className="flex space-x-2 mb-4">
                <Button
                    variant={!typeFilter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTypeFilter(null)}
                >
                    All
                </Button>
                {uniqueTypes.map((type) => (
                    <Button
                        key={type}
                        variant={typeFilter === type ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTypeFilter(typeFilter === type ? null : type)}
                    >
                        {type}
                    </Button>
                ))}
            </div>
            <DataTable
                isLoading={isLoading}
                columns={columns(meetingId, refreshData, currentUserId || '')}
                data={filteredFiles}
            />
        </div>
    )
}

export default FileList