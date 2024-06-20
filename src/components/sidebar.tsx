import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, Package, Package2, Video, User, History } from 'lucide-react';
import useAuthStore from '@/stores/authStore';
import defineAbilityFor from '@/pages/users/ability';

function Sidebar() {
    const router = useRouter();
    const { role, fetchUserRole } = useAuthStore((state) => state);
    const ability = defineAbilityFor(role || '');

    useEffect(() => {
        fetchUserRole();
    }, [fetchUserRole]);

    const isActive = (pathname: string) => '/' + router.pathname.split('/')[1] === pathname;
    
    return (
        <nav className="px-2 text-sm font-semibold lg:px-4">
            <Link
                href="/dashboard"
                className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${
                    isActive('/dashboard')
                        ? 'bg-slate-200 text-primary'
                        : 'text-muted-foreground'
                }`}
            >
                <Home className="h-4 w-4" />
                <span className="hidden mt-1 group-hover:inline pr-5">Dashboard</span>
            </Link>
            <Link
                href="/meeting"
                className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${
                    isActive('/meeting')
                        ? 'bg-slate-200 text-primary'
                        : 'text-muted-foreground'
                }`}
            >
                <Video className="h-4 w-4" />
                <span className="hidden mt-1 group-hover:inline pr-5">Meeting</span>
            </Link>
            {/* <Link
                href="/storage"
                className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${
                    isActive('/storage')
                        ? 'bg-slate-200 text-primary'
                        : 'text-muted-foreground'
                }`}
            >
                <Package2 className="h-4 w-4" />
                <span className="hidden mt-1 group-hover:inline pr-5">Storage</span>
            </Link> */}
            <Link
                href="/meetinghistory"
                className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${
                    isActive('/meetinghistory')
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
                    className={`min-h-[40px] flex items-center gap-3 rounded-lg py-2 px-3 hover:text-primary ${
                        isActive('/users')
                            ? 'bg-slate-200 text-primary'
                            : 'text-muted-foreground'
                    }`}
                >
                    <User className="h-4 w-4" />
                    <span className="hidden mt-1 group-hover:inline pr-5">User</span>
                </Link>
            )}
        </nav>
    );
}

export default Sidebar;
