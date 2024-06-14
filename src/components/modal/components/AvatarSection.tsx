import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/types/userProfile.type";
import { Pencil } from "lucide-react";

interface AvatarSectionProps {
    setAvatarFile: (file: File | null) => void;
    userData: UserProfile;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ setAvatarFile, userData }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatarFile(e.target.files[0]);
            setSelectedImage(URL.createObjectURL(e.target.files[0]));
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <div className="relative cursor-pointer">
                    <Avatar className="h-32 w-32">
                        <AvatarImage src={selectedImage || userData.avatar} className="rounded-full" />
                        <AvatarFallback>Avatar</AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow">
                        <Pencil className="h-5 w-5" />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <input type="file" accept="image/*" onChange={handleFileChange} />
            </PopoverContent>
        </Popover>
    );
};

export default AvatarSection;
