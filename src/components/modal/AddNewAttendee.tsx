import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button'
import { Attendee } from '@/types/attendee.type';
import Select from 'react-select';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onAddAttendees: () => void;
}

const options: Attendee[] = [
    {
        id: "1",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "2",
        name: 'Nghia Ngo',
        avatar: "http://localhost:3000/_next/image?url=%2Fimages%2FlogoCLT.png&w=128&q=75"
    },
    {
        id: "3",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "4",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
    {
        id: "5",
        name: 'Dat Doan',
        avatar: "https://github.com/shadcn.png"
    },
];

const formatOptionLabel = ({ name, avatar }: Attendee) => (
    <div className='flex items-center'>
        <img src={avatar} alt={name} style={{ width: 30, height: 30, marginRight: 10, borderRadius: '50%' }} />
        <span className='text-sm'>{name}</span>
    </div>
);

const filterOptions = (option: any, input: string) => {
    if (!input) {
        return false;
    }
    return option.data.name.toLowerCase().includes(input.toLowerCase());
};

const customStyles = {
    control: (provided: any, state: any) => ({
        ...provided,
        borderColor: state.isFocused ? 'black' : 'black', // 
        '&:hover': {
            borderColor: 'black' // Viền màu đen khi hover
        },
        fontSize: '14px'
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: 'black', // Màu chữ của placeholder
    }),

};

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
                <div className="space-y-5">
                    <Label className="col-span-full" htmlFor="Attendees">Attendees</Label>
                    <div className="lg:flex lg:space-x-3 space-x-0 space-y-3 lg:space-y-0">
                        <Select
                            options={options}
                            getOptionLabel={(option) => option.name}
                            getOptionValue={(option) => option.id}
                            formatOptionLabel={formatOptionLabel}
                            onChange={handleAttendeeChange}
                            placeholder="Select an attendee..."
                            isSearchable={true}
                            filterOption={filterOptions}
                            className='lg:w-[90%] w-full'
                            isClearable={true}
                            styles={customStyles}
                        />
                        <Button
                            className='lg:w-auto w-full'
                            variant={"secondary"}
                            onClick={addNewAttendee}
                        >
                            Add
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {attendees && attendees.length > 0 && attendees.map((attendee, index) => (
                        <div className='flex justify-between items-center rounded-full border border-black px-3 py-2 text-[12px]'>
                            <div className="flex items-center space-x-2">
                                <Avatar className='w-[20px] h-[20px]'>
                                    <AvatarImage src={attendee.avatar} alt="@shadcn" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className='max-w-[80px] truncate'>{attendee.name}</p>
                            </div>
                            <div onClick={() => removeAttendee(index)} className='cursor-pointer text-sm'>x</div>
                        </div>
                    ))}
                </div>

                <DialogFooter className="sm:justify-end">
                    <div className="flex space-x-4 justify-end">
                        <Button onClick={onCloseModal}>Save</Button>
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