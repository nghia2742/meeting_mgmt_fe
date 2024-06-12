import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { Inter } from "next/font/google";
import { FileIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { isImage } from '@/utils/image.util';
import { Progress } from '@/components/ui/progress';
import { AxiosProgressEvent } from 'axios';
import { toast } from '../ui/use-toast';
import { getExtension } from '@/utils/get-extension.util';

const inter = Inter({ subsets: ["latin"] });

export interface FilePreview {
    preview: string;
    name: string;
    type: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddFile: () => void;
    meetingId: string;
}

const AddNewFile = ({ isOpen, onClose, meetingId, onAddFile }: Props) => {

    const [files, setFiles] = useState<FilePreview[]>([]);
    const [uploading, setUploading] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const [uploadedSize, setUploadedSize] = useState(0);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const totalSize = acceptedFiles.reduce((total, file) => total + file.size, 0);
        console.log(totalSize);
        setTotalSize(totalSize);
        setUploading(true);

        const uploadPromises = acceptedFiles.map(file => uploadFile(file));
        await Promise.all(uploadPromises);

        setUploading(false);
        setTotalSize(0);
        setUploadedSize(0);
    }, []);

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await apiClient.post('/cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                    setUploadedSize(prevSize => prevSize + progressEvent.loaded);
                },
            });
            if (response && response.data) {
                setFiles(prevFiles => [
                    ...prevFiles,
                    {
                        preview: response.data.secure_url,
                        name: file.name,
                        type: getExtension(response.data.secure_url)
                    },
                ]);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const onCloseModal = () => {
        onClose();
        setFiles([]);
    }

    const onAddNewFile = async () => {
        let countUpload = 0;
        if (files.length === 0) {
            alert("Please upload at least one file!");
        } else {
            try {
                for (let file of files) {
                    const response = await apiClient.post('/files', {
                        name: file.name,
                        type: file.type,
                        link: file.preview,
                        meetingId
                    })
                    if (response && response.data) {
                        countUpload++;
                    }
                }
                if (countUpload === files.length) {
                    toast({
                        title: "Successfully",
                        description: "Create files successfully",
                        variant: "success",
                    });
                    onCloseModal();
                    onAddFile();
                }
            } catch (error: any) {
                console.error('Error uploading file:', error.response.data.message);
                toast({
                    title: "Uh oh! Something went wrong",
                    description: error.response.data.message,
                    variant: "destructive",
                });
                onCloseModal();
            }
        }
    }

    const progressPercentage = totalSize !== 0 ? (uploadedSize / totalSize) * 100 : 0;
    console.log(progressPercentage);

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className={`${inter.className}`}>
                <DialogHeader>
                    <DialogTitle>Add new file</DialogTitle>
                </DialogHeader>
                <div {...getRootProps()}
                    className="flex flex-col items-center justify-center 
                    border-2 border-dashed border-gray-300 p-6 rounded-md 
                    cursor-pointer hover:border-black-500 transition duration-300"
                >
                    <Input multiple {...getInputProps()} />
                    <FileIcon size={40} className="text-gray-500 mb-2" />
                    <p className="text-gray-500">Drag or drop file here</p>
                </div>
                {uploading === true ?
                    <Progress value={progressPercentage} /> : <div className="flex flex-wrap">
                        <div className="flex flex-wrap items-center">
                            {files.map(file => (
                                <div key={file.name} className="p-2 flex flex-col items-center">
                                    {isImage(file) ? (
                                        <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                                    ) : (
                                        <FileIcon width={72} height={72} className="text-gray-500 mb-2" />
                                    )}
                                    <p className="text-xs text-gray-500 max-w-[90px] truncate">{file.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>}

                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button onClick={onAddNewFile}>Save</Button>
                        <Button onClick={onCloseModal} type="button" variant="secondary">
                            Close
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog >
    )
}

export default AddNewFile