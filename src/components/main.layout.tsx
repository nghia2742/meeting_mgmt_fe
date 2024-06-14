import Link from 'next/link';
import { CircleUser, Home, Package, Package2, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ReactNode, useEffect, useState } from 'react';

import Image from 'next/image';
import { Inter } from 'next/font/google';
import Sidebar from './sidebar';
import SidebarMobile from './sidebar-mobile';
import SettingsModal from './modal/settingModal';
import useLogout from '@/hooks/useLogout';
import useUserStore from '@/stores/userStore';

const inter = Inter({ subsets: ['latin'] });

export function MainLayout({ children }: { children: ReactNode }) {
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
        <div className={`flex min-h-screen w-full ${inter.className}`}>
            <div className="hidden lg:block transition-all fixed top-0 left-0 h-full max-h-screen border-r bg-muted z-20 min-w-[70px] group">
                <div className="flex flex-col gap-2">
                    <div className="my-2">
                        {/* LOGO */}
                        <Link
                            href="/"
                            className="flex items-center justify-center"
                        >
                            <Image
                                src="/images/logoCLT.png"
                                width="0"
                                height="0"
                                sizes="64px"
                                className="w-[64px] h-auto"
                                priority={true}
                                alt="Logo CLT"
                            />
                        </Link>
                    </div>
                    <Sidebar />
                </div>
            </div>
            <div className="lg:ml-[70px] flex w-full flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <SidebarMobile />
                    <div className="w-full flex-1"></div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="flex items-center gap-4 p-0 hover:bg-muted cursor-pointer">
                                {userProfile?.avatar ? (
                                    <>
                                        <Image
                                            src={userProfile.avatar}
                                            alt="User Avatar"
                                            width={0}
                                            height={0}
                                            sizes='100px'
                                            className="w-8 h-auto rounded-full"
                                        />
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
                        <DropdownMenuContent className="w-32">
                            <DropdownMenuItem onClick={openModal}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem>Support</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => logout()} className='text-destructive'>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
            <SettingsModal
                isOpen={isModalOpen}
                onClose={closeModal}
            ></SettingsModal>
        </div>
    );
}

export default MainLayout;
