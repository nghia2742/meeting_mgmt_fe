import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import AddMeetingForm from '../meeting/AddMeetingForm';
import { DialogTitle } from '@radix-ui/react-dialog';
import { useMeetingStore } from '@/stores/meetingStore';

function AddNewMeeting() {
    const {isOpenAddForm, setIsOpenForm} = useMeetingStore()

    return (
        <Dialog open={isOpenAddForm} onOpenChange={setIsOpenForm}>
            <DialogTrigger asChild>
                <Button>Add new meeting</Button>
            </DialogTrigger>
            <DialogContent className='pr-0 md:w-lg max-h-[90vh] min-w-[50vw] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className="font-bold text-xl mb-4">Add a new meeting</DialogTitle>
                </DialogHeader>
                <AddMeetingForm />
            </DialogContent>
        </Dialog>
    );
}

export default AddNewMeeting;
