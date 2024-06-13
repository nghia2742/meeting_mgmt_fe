import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Inter } from "next/font/google"
import { Meeting } from '@/types/meeting.type'
import { Input } from '@/components/ui/input'
import { DateTimePickerForm } from '../timePicker/DateTimePickerForm'
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

const inter = Inter({ subsets: ["latin"] });

interface Props {
    isOpen: boolean;
    onClose: () => void;
    meeting: Meeting;
    attendees: Attendee[];
    files: MeetingFile[];
    refreshMeeting: () => void;
}

const PreviewMeetingMinute = ({ isOpen, onClose, meeting, attendees, files, refreshMeeting }: Props) => {

    const onCloseModal = () => {
        onClose();
        setFormData({
            title: '',
            tag: '',
            description: '',
            location: '',
            note: '',
            attendees,
            files,
        });
        setStartTime(new Date());
        setEndTime(new Date());
    }

    const [formData, setFormData] = useState({
        title: '',
        tag: '',
        description: '',
        location: '',
        note: '',
        attendees,
        files: files
    })

    useEffect(() => {
        setFormData({
            title: meeting.title,
            tag: meeting.type,
            description: meeting.description,
            location: meeting.location,
            note: meeting.note,
            attendees,
            files: files,
        });
        setStartTime(meeting.startTime);
        setEndTime(meeting.endTime);
    }, [isOpen])

    const [startTime, setStartTime] = useState<Date>(meeting.startTime);
    const [endTime, setEndTime] = useState<Date>(meeting.endTime);
    const { formattedDate, formattedTime } = formatDateTime(startTime.toString());
    const minutes = calcMinutes(startTime.toString(), endTime.toString());
    const { toast } = useToast();
    const { user } = useCreatedBy(meeting.createdBy);
    //Show preview PDF
    const [showPreview, setShowPreview] = useState(false);

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        if (id !== 'attendees' || id !== 'files') {
            setFormData(prevState => ({
                ...prevState,
                [id]: value
            }));
        }
    };

    const onSaveMeetingMinutes = async () => {
        const doc = <MeetingPDF
            {...formData}
            startTime={formattedTime}
            date={formattedDate}
            duration={minutes.toString()}
            createdBy={user}
        />;
        const asPdf = pdf();
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob();

        const formDataUpload = new FormData();
        formDataUpload.append('file', new Blob([blob], { type: 'application/pdf' }), `${formData.title}_meeting_minutes.pdf`);

        try {
            const response = await apiClient.post('/cloudinary/upload', formDataUpload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response && response.status === 201) {
                let responseCreateMeetingMinutes = await apiClient.post('/meetingminutes', {
                    name: `${formData.title}_meeting_minutes.pdf`,
                    link: response.data.secure_url,
                    meetingId: meeting.id
                });
                if (responseCreateMeetingMinutes && responseCreateMeetingMinutes.status === 201) {
                    toast({
                        title: "Successfully",
                        description: "Create meeting minutes successfully",
                        variant: "success",
                    });
                    const responseUpdateMeeting = await apiClient.patch(`/meetings/${meeting.id}`, {
                        ...formData,
                        startTime: startTime,
                        endTime: endTime,
                    });
                    if(responseUpdateMeeting) {
                        toast({
                            title: "Successfully",
                            description: "Update meeting successfully",
                            variant: "success",
                        });
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
        }
    }

    const onChangeDate = (date: Date, type: string) => {
        if (type === 'start') {
            if (endTime && differenceInMilliseconds(date, endTime) > 0) {
                alert('Start time must be equal to or earlier than end time');
            } else {
                setStartTime(date);
            }
        } else if (type === 'end') {
            if (startTime && differenceInMilliseconds(date, startTime) < 0) {
                alert('End time must be equal to or later than start time');
            } else {
                setEndTime(date);
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
                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 gap-x-8 px-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                className="col-span-3"
                                placeholder="Enter title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                className="col-span-3"
                                placeholder="Enter location"
                                value={formData.location}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-4">
                            <DateTimePickerForm
                                time={meeting.startTime}
                                title="Start time"
                                onChangeDate={(date) => {console.log(date); onChangeDate(date ? date : new Date(), "start")}}
                            />
                        </div>
                        <div className="space-y-4">
                            <DateTimePickerForm
                                time={meeting.endTime}
                                title="Endtime"
                                onChangeDate={(date) => onChangeDate(date ? date : new Date(), "end")}
                            />
                        </div>
                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                className="col-span-3"
                                placeholder="Enter description"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2 col-span-full">
                            <Label htmlFor="note">Note</Label>
                            <Textarea
                                id="note"
                                className="col-span-3"
                                placeholder="Enter note"
                                value={formData.note}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    {showPreview && (
                        <div className="mt-4 px-2">
                            <PDFViewer width="100%" height="500">
                                <MeetingPDF
                                    {...formData}
                                    startTime={formattedTime}
                                    date={formattedDate}
                                    duration={minutes.toString()}
                                    createdBy={user}
                                />
                            </PDFViewer>
                        </div>
                    )}
                </div>

                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button variant="outline" onClick={() => setShowPreview(true)}>Preview</Button>
                        <Button onClick={onSaveMeetingMinutes}>Create</Button>
                        <Button onClick={onCloseModal} type="button" variant="secondary">Close</Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewMeetingMinute