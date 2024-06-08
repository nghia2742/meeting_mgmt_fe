import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Package, Package2, Video, User } from 'lucide-react';

function Sidebar() {
    const router = useRouter();

    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive('/dashboard')
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground'
                }`}
            >
                <Home className="h-4 w-4" />
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
                <Package className="h-4 w-4" />
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
                <Video className="h-4 w-4" />
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
                <Package2 className="h-4 w-4" />
                Storage
            </Link>
            <Link
                href="/users"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    isActive('/users')
                        ? 'bg-muted text-primary'
                        : 'text-muted-foreground'
                }`}
            >
                <User className="h-4 w-4" />
                User
            </Link>
        </nav>
    );
}

export default Sidebar;
