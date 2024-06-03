import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Menu, Package, Package2, Video } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

function SidebarMobile() {
    const router = useRouter();

    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
                <nav className="grid gap-2 text-lg font-medium">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-semibold"
                    >
                        <Image
                            src="/images/logoCLT.png"
                            height={75}
                            width={75}
                            priority={true}
                            alt="Logo CLT"
                        />
                        <span className="sr-only">CLT</span>
                    </Link>
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            isActive('/dashboard')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <Home className="h-5 w-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/project"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            isActive('/project')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <Package className="h-5 w-5" />
                        Projects
                    </Link>
                    <Link
                        href="/meeting"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            isActive('/meeting')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <Video className="h-5 w-5" />
                        Meetings
                    </Link>
                    <Link
                        href="/storage"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                            isActive('/storage')
                                ? 'bg-muted text-primary'
                                : 'text-muted-foreground'
                        }`}
                    >
                        <Package2 className="h-5 w-5" />
                        Storage
                    </Link>
                </nav>
            </SheetContent>
        </Sheet>
    );
}

export default SidebarMobile;
