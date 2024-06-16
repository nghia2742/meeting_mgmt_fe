import Link from 'next/link';
import { ReactNode } from 'react';

import Image from 'next/image';
import Sidebar from './sidebar';
import SidebarMobile from './sidebar-mobile';
import UserDropdownMenu from './userDropdownMenu';

export function MainLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full">
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
                    <UserDropdownMenu />
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default MainLayout;
