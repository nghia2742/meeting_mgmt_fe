import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'
import { Attendee } from '@/types/attendee.type';
import { useState } from 'react';
import { Inter } from "next/font/google";
import AddAttendee from '../attendee/AddAttendee';
import attendeeOptions from '@/const/attendee-options';

const inter = Inter({ subsets: ["latin"] });

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddAttendees: () => void;
}

const AddNewAttendee = ({ isOpen, onClose, onAddAttendees }: Props) => {

    const [attendee, setAttendee] = useState<Attendee>();
    const [attendees, setAttendees] = useState<Attendee[]>([]);

    const handleAttendeeChange = (selectedOption: Attendee | null) => {
        if (selectedOption) {
            setAttendee(selectedOption);
        }
    };

    const addNewAttendee = () => {
        if (attendee) {
            setAttendees([...attendees, attendee]);
        }
    };

    const onCloseModal = () => {
        onClose();
        setAttendees([]);
    }

    const removeAttendee = (index: number) => {
        const newAttendess = [...attendees];
        newAttendess.splice(index, 1);
        setAttendees(newAttendess);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onCloseModal}>
            <DialogContent className={`${inter.className}`}>
                <DialogHeader>
                    <DialogTitle>Add new attendee</DialogTitle>
                </DialogHeader>
                <AddAttendee
                    attendees={attendees}
                    options={attendeeOptions}
                    handleAttendeeChange={handleAttendeeChange}
                    addNewAttendee={addNewAttendee}
                    removeAttendee={removeAttendee}
                />
                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button onClick={onAddAttendees}>Save</Button>
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