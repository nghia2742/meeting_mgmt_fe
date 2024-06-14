import { Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center p-24 ">
            Hello world
            <Link href="/dashboard" className="flex gap-2 text-sky-400">
                <LinkIcon /> Go to dashboard
            </Link>
            <Link href="/auth/login" className="flex gap-2 text-sky-400">
                <LinkIcon /> Go to login
            </Link>
        </main>
    );
}

export default Home;
