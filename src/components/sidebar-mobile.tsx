import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { History, Home, Menu, Package, Package2, Video, User } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import ability from '@/pages/users/ability';
import defineAbilityFor from '@/pages/users/ability';
import useAuthStore from '@/stores/authStore';

function SidebarMobile() {
    const router = useRouter();

    const isActive = (pathname: string) =>
        '/' + router.pathname.split('/')[1] === pathname;

    const { role, fetchUserRole } = useAuthStore((state) => state);

    const ability = defineAbilityFor(role);


    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 text-lg font-semibold"
                    >
                        <Image
                            src="/images/logoCLT.png"
                            width="0"
                            height="0"
                            sizes="100px"
                            className="w-[100px] h-auto"
                            priority={true}
                            alt="Logo CLT"
                        />
                        <span className="sr-only">CLT</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/dashboard')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                            }`}
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/project"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/project')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                            }`}
                    >
                        <Package className="h-5 w-5" />
                        Project
                    </Link>
                    <Link
                        href="/meeting"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/meeting')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                            }`}
                    >
                        <Video className="h-5 w-5" />
                        Meeting
                    </Link>
                    <Link
                        href="/storage"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${isActive('/storage')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                            }`}
                    >
                        <Package2 className="h-5 w-5" />
                        Storage
                    </Link>
                    <Link
                        href="/meetinghistory"
                        className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${isActive('/meetinghistory')
                                ? 'bg-slate-200 text-primary'
                                : 'text-muted-foreground'
                            }`}
                    >
                        <History className="h-4 w-4" />
                        <span className="hidden mt-1 group-hover:inline pr-5">Meeting minutes</span>
                    </Link>
                    {ability.can('read', 'User') && (
                        <Link
                            href="/users"
                            className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${isActive('/users')
                                    ? 'bg-slate-200 text-primary'
                                    : 'text-muted-foreground'
                                }`}
                        >
                            <User className="h-4 w-4" />
                            User
                        </Link>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export default SidebarMobile;
