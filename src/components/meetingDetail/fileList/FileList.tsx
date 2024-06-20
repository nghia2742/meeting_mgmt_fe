import { MeetingFile } from '@/types/meeting.file.type'
import { columns } from './column'
import { DataTable } from './data-table'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import FileItem from './FileItem'
import { Grid, List } from 'lucide-react'

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
            <Tabs defaultValue='table' className='w-full mt-9'>
                <TabsList>
                    <TabsTrigger value='table'><List className='w-4 h-4'/></TabsTrigger>
                    <TabsTrigger value='files'><Grid className='w-4 h-4'/></TabsTrigger>
                </TabsList>
                <TabsContent value='table'>
                    <DataTable
                        isLoading={isLoading}
                        columns={columns(meetingId, refreshData, currentUserId || '')}
                        data={filteredFiles}
                    />
                </TabsContent>
                <TabsContent value='files'>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
                        {filteredFiles && filteredFiles.length > 0 && filteredFiles.map((file, index) => (
                            <div key={index}>
                                <FileItem refreshData={refreshData} currentUserId={currentUserId || ''} file={file} />
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default FileList