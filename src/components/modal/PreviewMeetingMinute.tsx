import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Meeting } from '@/types/meeting.type'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import { Attendee } from '@/types/attendee.type'
import { PDFViewer, pdf } from '@react-pdf/renderer'
import MeetingPDF from '../templates/meeting-pdf-template'
import { calcMinutes, formatDateTime } from '@/utils/datetime.util'
import { useToast } from "@/components/ui/use-toast";
import apiClient from '@/lib/apiClient'
import useCreatedBy from '@/hooks/useCreatedBy'
import { MeetingFile } from '@/types/meeting.file.type'
import { differenceInMilliseconds } from 'date-fns'
import { Inter } from 'next/font/google';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from '@/components/timePicker/TimePicker';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import ClipLoader from 'react-spinners/ClipLoader'

const inter = Inter({ subsets: ['latin'] });

interface Props {
    isOpen: boolean;
    onClose: () => void;
    meeting: Meeting;
    attendees: Attendee[];
    files: MeetingFile[];
    refreshMeeting: () => void;
}

const schema = z.object({
    title: z.string().nonempty("Title is required"),
    description: z.string().nonempty("Description is required"),
    location: z.string().nonempty("Location is required"),
    note: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    formattedDate: z.string(),
    formattedTime: z.string(),
    minutes: z.number(),
})

export type FormSchemaMeetingMinuteType = z.infer<typeof schema>;

const PreviewMeetingMinute = ({ isOpen, onClose, meeting, attendees, files, refreshMeeting }: Props) => {
    const [isCreating, setIsCreating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const form = useForm<FormSchemaMeetingMinuteType>({
        resolver: zodResolver(schema),
    });

    const { handleSubmit, control, setValue, getValues, formState: { errors }, setError, clearErrors } = form;

    const onCloseModal = () => {
        setValue("title", '');
        setValue("description", '');
        setValue("location", '');
        setValue("note", '');
        setValue("startTime", new Date());
        setValue("endTime", new Date());
        setValue("formattedDate", '');
        setValue("formattedTime", '');
        setValue("minutes", 0);
        clearErrors();
        onClose();
    }

    useEffect(() => {
        if (meeting) {
            setValue("title", meeting.title);
            setValue("description", meeting.description);
            setValue("location", meeting.location);
            setValue("note", meeting.note);
            setValue("startTime", new Date(meeting.startTime));
            setValue("endTime", new Date(meeting.endTime));
            setValue("formattedDate", formatDateTime(meeting.startTime.toString()).formattedDate);
            setValue("formattedTime", formatDateTime(meeting.startTime.toString()).formattedTime);
            setValue("minutes", calcMinutes(meeting.startTime.toString(), meeting.endTime.toString()))
        }
    }, [isOpen, meeting, setValue]);

    const { toast } = useToast();
    const { user } = useCreatedBy(meeting.createdBy);

    const onSaveMeetingMinutes: SubmitHandler<FormSchemaMeetingMinuteType> = async () => {
        if (!validateTimes(getValues("startTime"), getValues("endTime"))) {
            return;
        }

        setIsCreating(true);

        const doc = <MeetingPDF
            {...getValues()}
            startTime={getValues("formattedTime")}
            date={getValues("formattedDate")}
            duration={getValues("minutes").toString()}
            createdBy={user}
            attendees={attendees}
            files={files}
        />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();

        const formDataUpload = new FormData();
        formDataUpload.append('file', new Blob([blob], { type: 'application/pdf' }), `${getValues("title")}_meeting_minutes.pdf`);

        try {
            const response = await apiClient.post('/cloudinary/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response && response.status === 201) {
                let responseCreateMeetingMinutes = await apiClient.post('/meetingminutes', {
                    name: `${getValues("title")}_meeting_minutes.pdf`,
                    link: response.data.secure_url,
                    publicId: response.data.public_id,
                    meetingId: meeting.id
                });
                if (responseCreateMeetingMinutes && responseCreateMeetingMinutes.status === 201) {
                    toast({
                        title: "Successfully",
                        description: "Create meeting minutes successfully",
                        variant: "success",
                    });
                    const responseUpdateMeeting = await apiClient.patch(`/meetings/${meeting.id}`, {
                        ...getValues(),
                        startTime: getValues("startTime"),
                        endTime: getValues("endTime"),
                    });
                    if (responseUpdateMeeting) {
                        toast({
                            title: "Successfully",
                            description: "Update meeting successfully",
                            variant: "success",
                        });
                        setIsCreating(false);
                        refreshMeeting();
                        onCloseModal();
                    }
                }
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            toast({
                title: "Oops! Something went wrong",
                description: error.response.data.message,
                variant: "destructive",
            });
            setIsCreating(false);
        }
    }

    const validateTimes = (startTime: Date, endTime: Date) => {
        let isValid = true;
        if (differenceInMilliseconds(startTime, endTime) > 0) {
            setError("startTime", {
                type: "manual",
                message: "Start time must be smaller than end time",
            });
            setError("endTime", {
                type: "manual",
                message: "End time must be greater than start time",
            });
            isValid = false;
        } else {
            clearErrors("startTime");
            clearErrors("endTime");
            isValid = true;
        }
        return isValid;
    }

    const onChangeDate = (date: Date | undefined, type: string) => {
        if (date) {
            if (type === 'start') {
                setValue("startTime", date);
                setValue("formattedDate", formatDateTime(date.toString()).formattedDate);
                setValue("formattedTime", formatDateTime(date.toString()).formattedTime);
                setValue("minutes", calcMinutes(date.toString(), getValues("endTime").toString()));
                validateTimes(date, getValues("endTime"));
            } else if (type === 'end') {
                setValue("endTime", date);
                setValue("minutes", calcMinutes(getValues("startTime").toString(), date.toString()));
                validateTimes(getValues("startTime"), date);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className={`lg:min-w-[800px] w-full ${inter.className}`}>
                <DialogHeader>
                    <DialogTitle className='px-2'>Preview meeting minute</DialogTitle>
                </DialogHeader>
                <div className="max-h-[500px] overflow-x-hidden overflow-y-auto">
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSaveMeetingMinutes)} className="grid lg:grid-cols-2 grid-cols-1 gap-4 gap-x-8 px-2">
                            <FormField
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-bold mb-2">
                                            Title
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Title"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="block text-sm font-bold mb-2">
                                            Location
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="Location"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="space-y-4">
                                <FormField
                                    control={control}
                                    name="startTime"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="startTime" className="text-left">Start time</FormLabel>
                                            <Popover>
                                                <FormControl className="w-full">
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP HH:mm:ss'
                                                                )
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>
                                                <PopoverContent className="w-full p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            onChangeDate(date, "start");
                                                        }}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t border-border">
                                                        <TimePicker
                                                            setDate={(date) => {
                                                                field.onChange(date);
                                                                onChangeDate(date, "start");
                                                            }}
                                                            date={new Date(field.value)}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            {errors.startTime && <p className='text-red-500 text-[13px]'>{errors.startTime.message}</p>}
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-4">
                                <FormField
                                    control={control}
                                    name="endTime"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel htmlFor="endTime" className="text-left">End time</FormLabel>
                                            <Popover>
                                                <FormControl className="w-full">
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className={cn(
                                                                "w-full justify-start text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {field.value ? (
                                                                format(
                                                                    field.value,
                                                                    'PPP HH:mm:ss'
                                                                )
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                        </Button>
                                                    </PopoverTrigger>
                                                </FormControl>
                                                <PopoverContent className="w-full p-0">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={(date) => {
                                                            if (date) {
                                                                field.onChange(date);
                                                                onChangeDate(date, "end");
                                                            }
                                                        }}
                                                        initialFocus
                                                    />
                                                    <div className="p-3 border-t border-border">
                                                        <TimePicker
                                                            setDate={(date) => {
                                                                if (date) {
                                                                    field.onChange(date);
                                                                    onChangeDate(date, "end");
                                                                }
                                                            }}
                                                            date={new Date(field.value)}
                                                        />
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                            {errors.endTime && <p className='text-red-500 text-[13px]'>{errors.endTime.message}</p>}
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2 col-span-full">
                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-bold mb-2">
                                                Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="description"
                                                    className="col-span-3"
                                                    placeholder="Enter description"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="space-y-2 col-span-full">
                                <FormField
                                    control={control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="block text-sm font-bold mb-2">
                                                Note
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    id="note"
                                                    className="col-span-3"
                                                    placeholder="Enter note"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="col-span-full">
                                {showPreview && (
                                    <div className="mt-4 px-2 w-full">
                                        <PDFViewer width="100%" height="500">
                                            <MeetingPDF
                                                {...getValues()}
                                                startTime={getValues("formattedTime")}
                                                date={getValues("formattedDate")}
                                                duration={getValues("minutes").toString()}
                                                createdBy={user}
                                                attendees={attendees}
                                                files={files}
                                            />
                                        </PDFViewer>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-4 col-span-full justify-end">
                                <Button variant="outline" onClick={(e) => { e.preventDefault(); setShowPreview(true) }}>Preview</Button>
                                <Button type='submit' disabled={isCreating}>
                                    {isCreating && (
                                        <ClipLoader
                                            className="mr-2"
                                            color="#ffffff"
                                            size={16}
                                        />
                                    )}
                                    Create
                                </Button>
                                <Button onClick={onCloseModal} type="button" variant="secondary">Close</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewMeetingMinute
