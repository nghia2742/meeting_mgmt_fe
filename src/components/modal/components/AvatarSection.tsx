import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/userProfile.type";

interface AvatarSectionProps {
    setAvatarFile: (file: File | null) => void;
    userData: UserProfile;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ setAvatarFile, userData }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    return (
        <Popover>
            <PopoverTrigger>
                <Avatar className="h-[200px] w-[200px] cursor-pointer">
                    <AvatarImage src={userData.avatar} className="rounded-full" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </PopoverTrigger>
            <PopoverContent>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </PopoverContent>
        </Popover>
    );
};

export default AvatarSection;
