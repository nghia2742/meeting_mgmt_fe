import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'
import { Attendee } from '@/types/attendee.type';
import { useState } from 'react';
import AddAttendee from '../attendee/AddAttendee';
import apiClient from '@/lib/apiClient';
import { toast } from '@/components/ui/use-toast';
import { Inter } from 'next/font/google';
import ClipLoader from 'react-spinners/ClipLoader';

const inter = Inter({ subsets: ['latin'] });

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddAttendees: () => void;
    attendees: Attendee[] | undefined;
    meetingId: string;
}

const AddNewAttendee = ({ isOpen, onClose, onAddAttendees, attendees, meetingId }: Props) => {
    const [attendeesAdd, setAttendeesAdd] = useState<Attendee[]>([]);

    const [isEmptyAttendee, setIsEmptyAttendee] = useState(false);
    const [isAddingAttendees, setIsAddingAttendees] = useState(false);

    const handleAttendeeChange = (selectedOption: Attendee | null) => {
        setIsEmptyAttendee(false);
        console.log(attendeesAdd);
        if (selectedOption) {
            const duplicateAttendees = attendeesAdd.find((attendee) => attendee.id === selectedOption.id);
            if (duplicateAttendees) {
                alert('This attendee is added');
            } else {
                setAttendeesAdd([...attendeesAdd, selectedOption]);
            }
        }
    };

    const onCloseModal = () => {
        onClose();
        setAttendeesAdd([]);
        setIsEmptyAttendee(false);
    }

    const removeAttendee = (index: number) => {
        const newAttendess = [...attendeesAdd];
        newAttendess.splice(index, 1);
        setAttendeesAdd(newAttendess);
    }

    const handleAddAttendees = async () => {
        if (attendeesAdd.length === 0) {
            setIsEmptyAttendee(true);
        } else {
            let countAdd = 0;
            try {
                setIsAddingAttendees(true);
                for (let attendeeAdd of attendeesAdd) {
                    const response = await apiClient.post('/usermeetings', {
                        userId: attendeeAdd.id,
                        meetingId: meetingId
                    });
                    if (response && response.data) {
                        countAdd++;
                    }
                }
                if (countAdd === attendeesAdd.length) {
                    toast({
                        title: "Successfully",
                        description: "Add new attendee successfully. Please wait for response",
                        variant: "success",
                    });
                    setIsAddingAttendees(false);
                    onAddAttendees();
                    onCloseModal();
                }
            } catch (error: any) {
                console.error('Error add attendee:', error);
                toast({
                    title: "Uh oh! Something went wrong",
                    description: error.response.data.message,
                    variant: "destructive",
                });
                setIsAddingAttendees(false);
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className={`${inter.className}`}>
                <DialogHeader>
                    <DialogTitle>Add new attendee</DialogTitle>
                </DialogHeader>
                <AddAttendee
                    attendees={attendeesAdd}
                    options={attendees || []}
                    handleAttendeeChange={handleAttendeeChange}
                    removeAttendee={removeAttendee}
                    maxWidth={80}
                />
                {isEmptyAttendee && (
                    <p className="text-red-500 text-sm">Please choose at least one attendee</p>
                )}
                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button
                            onClick={handleAddAttendees}
                            disabled={isAddingAttendees}
                        >
                            {isAddingAttendees && (
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

export default AddNewAttendee