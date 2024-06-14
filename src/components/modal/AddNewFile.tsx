import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { FileIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { isImage } from '@/utils/image.util';
import { toast } from '../ui/use-toast';
import { getExtension } from '@/utils/get-extension.util';

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
    const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);

        // const uploadPromises = acceptedFiles.map(file => uploadFile(file));
        // await Promise.all(uploadPromises);
        acceptedFiles.forEach(file => {
            setFiles(prevFiles => [
                ...prevFiles,
                {
                    preview: URL.createObjectURL(file),
                    name: file.name,
                    type: file.type
                }
            ])
        });
        setAcceptedFiles(acceptedFiles);
        setUploading(false);
    }, []);

    const createFile = async (acceptedFiles: File[]) => {
        let countCreateFile = 0;
        for (let acceptedFile of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', acceptedFile);
            const response = await apiClient.post('/cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if(response && response.data) {
                const responseCreateFile = await apiClient.post('/files', {
                    name: acceptedFile.name,
                    type: getExtension(acceptedFile.name),
                    link: response.data.secure_url,
                    meetingId
                });
                if(responseCreateFile && responseCreateFile.data) {
                    countCreateFile++;
                }
            }
        }
        if(countCreateFile === acceptedFiles.length) {
            toast({
                title: "Successfully",
                description: "Create files successfully",
                variant: "success",
            });
            onAddFile();
            onCloseModal();
        }
    };

    const onDeleteImg = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        setFiles(newFiles);
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const onCloseModal = () => {
        onClose();
        setFiles([]);
    }

    const onAddNewFile = async () => {
        if (files.length === 0 || acceptedFiles.length === 0) {
            alert("Please upload at least one file!");
        } else {
            try {
                await createFile(acceptedFiles);
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

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent>
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
                    <p>Loading...</p> : <div className="flex flex-wrap">
                        <div className="flex flex-wrap items-center">
                            {files.map((file, index) => (
                                <div key={file.name} className="p-2 flex flex-col items-center relative">
                                    {isImage(file) ? (
                                        <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                                    ) : (
                                        <FileIcon width={72} height={72} className="text-gray-500 mb-2" />
                                    )}
                                    <p className="text-xs text-gray-500 max-w-[90px] truncate">{file.name}</p>
                                    <button
                                        onClick={() => onDeleteImg(index)}
                                        className='cursor-pointer absolute text-[12px] right-[-2px] top-[-4px] bg-black text-white px-2 py-0.5 rounded-full'
                                    >
                                        x
                                    </button>
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