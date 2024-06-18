import MainLayout from '@/components/main.layout';
import React from 'react';
import { columns } from './column';
import { DataTable } from './data-table';
import type { Meeting } from '@/types/meeting.type';
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Slash } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import { useAllMeeting } from '@/hooks/useMeeting';

const Meeting = () => {
    const { data: meetings } = useAllMeeting();

    return (
        <>
            <Head>
                <title>Meeting</title>
            </Head>
            <MainLayout>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/dashboard">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <Slash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage>Meeting</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <div className="container mx-auto py-10">
                    <DataTable columns={columns} data={meetings || []} />
                </div>
            </MainLayout>
        </>
    );
};

export default Meeting;
