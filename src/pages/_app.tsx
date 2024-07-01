import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from '@/lib/reactQueryClient';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
    
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <main className={inter.className}>
                    <Component {...pageProps} />
                </main>
                <Toaster />
            </TooltipProvider>
        </QueryClientProvider>
    );
}
