import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'
import { Attendee } from '@/types/attendee.type';
import { useState } from 'react';
import AddAttendee from '../attendee/AddAttendee';
import apiClient from '@/lib/apiClient';
import { toast } from '@/components/ui/use-toast';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddAttendees: () => void;
    attendees: Attendee[] | undefined;
    meetingId: string;
}

const AddNewAttendee = ({ isOpen, onClose, onAddAttendees, attendees, meetingId }: Props) => {

    const [attendee, setAttendee] = useState<Attendee>();
    const [attendeesAdd, setAttendeesAdd] = useState<Attendee[]>([]);

    const handleAttendeeChange = (selectedOption: Attendee | null) => {
        if (selectedOption) {
            setAttendee(selectedOption);
        }
    };

    const addNewAttendee = () => {
        if (attendee) {
            setAttendeesAdd([...attendeesAdd, attendee]);
        }
    };

    const onCloseModal = () => {
        onClose();
        setAttendeesAdd([]);
    }

    const removeAttendee = (index: number) => {
        const newAttendess = [...attendeesAdd];
        newAttendess.splice(index, 1);
        setAttendeesAdd(newAttendess);
    }

    const handleAddAttendees = async() => {
        if(attendeesAdd.length === 0) {
            alert("Please add at least one attendee");
        }else {
            let countAdd = 0;
            try {
                for(let attendeeAdd of attendeesAdd) {
                    const response = await apiClient.post('/usermeetings', {
                        userId: attendeeAdd.id,
                        meetingId: meetingId
                    });
                    if (response && response.data) {
                        countAdd++;
                    }
                }
                if(countAdd === attendeesAdd.length) {
                    toast({
                        title: "Successfully",
                        description: "Add new attendee successfully",
                        variant: "success",
                    });
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
                onCloseModal();
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add new attendee</DialogTitle>
                </DialogHeader>
                <AddAttendee
                    attendees={attendeesAdd}
                    options={attendees || []}
                    handleAttendeeChange={handleAttendeeChange}
                    addNewAttendee={addNewAttendee}
                    removeAttendee={removeAttendee}
                    maxWidth={80}
                />
                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button onClick={handleAddAttendees}>Save</Button>
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