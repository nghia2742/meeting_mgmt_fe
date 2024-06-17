import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Inter } from 'next/font/google';

import SettingsModal from './modal/settingModal';
import useLogout from '@/hooks/useLogout';
import useUserStore from '@/stores/userStore';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from './ui/avatar';

const inter = Inter({ subsets: ['latin'] });

function UserDropdownMenu() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userProfile, fetchUserProfile } = useUserStore((state) => ({
        userProfile: state.userProfile,
        fetchUserProfile: state.fetchUserProfile,
    }));
    const { mutate: logout } = useLogout();

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    useEffect(() => {
        if (!userProfile) {
            fetchUserProfile();
        }
    }, [fetchUserProfile, userProfile]);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div className="flex items-center gap-4 p-0 hover:bg-muted cursor-pointer">
                        {userProfile?.avatar ? (
                            <>
                                <Avatar >
                                    <AvatarImage src={userProfile.avatar || "/images/logoCLT.png"} className="w-8 h-8 rounded-full object-cover"/>
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>


                                <div className="text-sm font-semibold dark:text-white">
                                    <div>{userProfile?.fullName}</div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-slate-300 animate-pulse"></div>
                                <div className="h-5 w-32 bg-slate-300 animate-pulse"></div>
                            </>
                        )}
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={`w-32 ${inter.className}`}>
                    <DropdownMenuItem
                        onClick={openModal}
                        className="cursor-pointer"
                    >
                        Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                        Support
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="cursor-pointer text-destructive focus:text-destructive"
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SettingsModal
                isOpen={isModalOpen}
                onClose={closeModal}
            ></SettingsModal>
        </>
    );
}

export default UserDropdownMenu;
