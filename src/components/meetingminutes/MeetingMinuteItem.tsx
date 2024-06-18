import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { toast } from '@/components/ui/use-toast';
import apiClient from '@/lib/apiClient';
import { MeetingMinutes } from '@/types/meeting-minutes.type';
import { MoreVertical } from 'lucide-react';
import { Inter } from 'next/font/google';
import React from 'react'

const inter = Inter({ subsets: ['latin'] });

interface Props {
    file: MeetingMinutes;
    currentUserId: string;
    refreshData: () => void;
}

const MeetingMinutesItem = ({ file, currentUserId, refreshData }: Props) => {

    const onDeleteFile = async () => {
        try {
            let responseDelCloudinary = await apiClient.delete(`/cloudinary?publicId=${file.publicId}&type=pdf`);
            if (responseDelCloudinary && responseDelCloudinary.data.result === 'ok') {
                let responseDelFile = await apiClient.delete(`/files/${file.id}`);
                if (responseDelFile) {
                    toast({
                        title: "Successfully",
                        description: "Delete file successfully",
                        variant: "success",
                    });
                    refreshData();
                }
            }
        } catch (error: any) {
            console.log(error);
            toast({
                title: "Failed",
                description: error.response.data.message,
                variant: "destructive",
            });
        }
    }

    return (
        <a target="_blank" rel="noopener noreferrer" href={file.link} key={file.name} className="px-5 py-4 rounded-lg flex flex-col items-center border-black border space-y-4 relative">
            <DropdownMenu>
                <DropdownMenuTrigger asChild className='absolute top-2 right-0'>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className={`${inter.className}`}>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem><a className="w-full" href={file.link} target="_blank" rel="noopener noreferrer">View</a></DropdownMenuItem>
                    {file.createdBy === currentUserId && <DropdownMenuItem onClick={onDeleteFile} className='text-red-500'>Delete</DropdownMenuItem>}
                </DropdownMenuContent>
            </DropdownMenu>
            <img src={'/images/pdf.png'} alt={file.name} className="w-[120px] h-[120px] object-contain rounded-md" />
            <Tooltip>
                <TooltipTrigger>
                    <p className="text-sm text-gray-500 max-w-[100px] sm:max-w-[100px] lg:max-w-[140px] truncate">{file.name}</p>
                </TooltipTrigger>
                <TooltipContent className='text-xs'>{file.name}</TooltipContent>
            </Tooltip>
        </a>
    )
}

export default MeetingMinutesItem