import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DialogTitle } from '@radix-ui/react-dialog';
import { Edit } from 'lucide-react';
import EditMeetingForm from '../meeting/EditMeetingForm';
import { Meeting } from '@/types/meeting.type';
import { useMeetingStore } from '@/stores/meetingStore';

function EditMeeting({ meeting }: { meeting: Meeting }) {
    const { isOpenEditForm, setIsOpenEditForm } = useMeetingStore()
    
    return (
        <Dialog open={isOpenEditForm} onOpenChange={setIsOpenEditForm}>
            <DialogTrigger asChild>
                <Button size={'sm'}><Edit className='h-4- w-4'/></Button>
            </DialogTrigger>
            <DialogContent className='pr-0 md:w-lg max-h-[90vh] min-w-[50vw] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className="font-bold text-xl mb-2"> Edit meeting</DialogTitle>
                </DialogHeader>
                <EditMeetingForm meeting={meeting}/>
            </DialogContent>
        </Dialog>
    );
}

export default EditMeeting;
