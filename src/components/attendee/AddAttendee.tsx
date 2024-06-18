import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import React from 'react'
import { Button } from '@/components/ui/button';
import { Attendee } from '@/types/attendee.type';
import { X } from 'lucide-react';

interface Props {
    options: Attendee[],
    attendees: Attendee[],
    handleAttendeeChange: (selectedOption: Attendee | null) => void;
    removeAttendee: (index: number) => void;
    maxWidth: number;
}

const formatOptionLabel = ({ email, avatar }: Attendee) => (
    <div className='flex items-center'>
        <img src={avatar || "/images/logoCLT.png"} style={{ width: 30, height: 30, marginRight: 10, borderRadius: '50%' }} />
        <span className='text-sm'>{email}</span>
    </div>
);

const filterOptions = (option: any, input: string) => {
    if (!input) {
        return false;
    }
    return option.data.email.toLowerCase().includes(input.toLowerCase());
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

const AddAttendee = ({ options, attendees, handleAttendeeChange, removeAttendee, maxWidth }: Props) => {
    return (
        <div className='space-y-5'>
            <div className="space-y-5">
                <Label className="col-span-full" htmlFor="Attendees">Attendees</Label>
                <div className="lg:flex lg:space-x-3 space-x-0 space-y-3 lg:space-y-0">
                    <Select
                        options={options}
                        getOptionLabel={(option: Attendee) => option.email}
                        getOptionValue={(option: Attendee) => option.id}
                        formatOptionLabel={formatOptionLabel}
                        onChange={handleAttendeeChange}
                        placeholder="Select an attendee..."
                        isSearchable={true}
                        filterOption={filterOptions}
                        className='lg:w-[90%] w-full'
                        isClearable={true}
                        styles={customStyles}
                        value={null}
                    />
                </div>
            </div>
            <div className="flex flex-wrap gap-2">
                {attendees && attendees.length > 0 && attendees.map((attendee, index) => (
                    <div key={index} className="flex justify-between items-center rounded-full border border-black px-3 py-2 text-[12px] space-x-2">
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-[20px] h-[20px]">
                                <AvatarImage src={attendee.avatar || "/images/logoCLT.png"} alt="@shadcn" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <p>{attendee.email}</p>
                        </div>
                        <div onClick={() => removeAttendee(index)} className="cursor-pointer text-sm"><X className='w-3 h-3'/></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AddAttendee