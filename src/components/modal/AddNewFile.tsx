import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useDropzone } from 'react-dropzone'
import { FileIcon, X } from 'lucide-react';
import { Input } from '../ui/input';
import { useCallback, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { isImage } from '@/utils/image.util';
import { toast } from '../ui/use-toast';
import { getExtension } from '@/utils/get-extension.util';
import { Inter } from 'next/font/google';
import ClipLoader from 'react-spinners/ClipLoader';
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip';

const inter = Inter({ subsets: ['latin'] });

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
    const [isEmptyFile, setIsEmptyFile] = useState(false);
    const [isCreatingFiles, setIsCreatingFiles] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsEmptyFile(false);
        setUploading(true);

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
        const MAX_TOTAL_SIZE = 100 * 1024 * 1024; //100MB
        const MAX_FILE_SIZE = 20 * 1024 * 1024; //20MB
        for(let acceptedFile of acceptedFiles) {
            if(acceptedFile.size > MAX_FILE_SIZE) {
                toast({
                    title: "Error",
                    description: "File size exceeds 20MB. Please upload smaller files.",
                    variant: "destructive",
                });
                setIsCreatingFiles(false);
                return ;
            }
        }
        const totalSize = acceptedFiles.reduce((acc, file) => acc + file.size, 0);
    
        if (totalSize > MAX_TOTAL_SIZE) {
            toast({
                title: "Error",
                description: "Total file size exceeds 100MB. Please upload smaller files.",
                variant: "destructive",
            });
            setIsCreatingFiles(false);
            return;
        }
    
        let countCreateFile = 0;
        for (let acceptedFile of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', acceptedFile);
            const response = await apiClient.post('/cloudinary/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            if (response && response.data) {
                const responseCreateFile = await apiClient.post('/files', {
                    name: acceptedFile.name,
                    type: getExtension(acceptedFile.name),
                    link: response.data.secure_url,
                    publicId: response.data.public_id,
                    meetingId
                });
                if (responseCreateFile && responseCreateFile.data) {
                    countCreateFile++;
                }
            }
        }
    
        if (countCreateFile === acceptedFiles.length) {
            toast({
                title: "Successfully",
                description: "Create files successfully",
                variant: "success",
            });
            setIsCreatingFiles(false);
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
        setIsEmptyFile(false);
        setFiles([]);
    }

    const onAddNewFile = async () => {
        if (files.length === 0 || acceptedFiles.length === 0) {
            setIsEmptyFile(true);
        } else {
            setIsCreatingFiles(true);
            try {
                await createFile(acceptedFiles);
            } catch (error: any) {
                toast({
                    title: "Uh oh! Something went wrong",
                    description: error.response.data.message,
                    variant: "destructive",
                });
                setIsCreatingFiles(false);
            }
        }
    }

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
                    <p className='text-gray-500 text-[13px]'>Files up to 20MB</p>
                </div>
                {isEmptyFile && (
                    <p className="text-red-500 text-sm">Please upload at least one file</p>
                )}
                {uploading === true ?
                    <div>
                        <ClipLoader
                            className="mr-2"
                            color="#ffffff"
                            size={16}
                        />
                        Loading...
                    </div> : <div className="flex flex-wrap">
                        <div className="flex flex-wrap items-center">
                            {files.map((file, index) => (
                                <div key={file.name} className="p-2 flex flex-col items-center relative">
                                    {isImage(file.name) ? (
                                        <img src={file.preview} alt={file.name} className="w-20 h-20 object-cover rounded-md" />
                                    ) : (
                                        <FileIcon width={72} height={72} className="text-gray-500 mb-2" />
                                    )}
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <p className="text-xs text-gray-500 max-w-[90px] truncate">{file.name}</p>
                                        </TooltipTrigger>
                                        <TooltipContent className='text-[12px]'>{file.name}</TooltipContent>
                                    </Tooltip>
                                    <button
                                        onClick={() => onDeleteImg(index)}
                                        className='cursor-pointer absolute right-[-2px] top-[-4px] bg-black text-white px-1 py-1 rounded-full'
                                    >
                                        <X className='w-3 h-3' />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>}

                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button
                            onClick={onAddNewFile}
                        >
                            {isCreatingFiles && (
                                <ClipLoader
                                    className="mr-2"
                                    color="#ffffff"
                                    size={16}
                                />
                            )}
                            Save
                        </Button>
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