import MainLayout from '@/components/main.layout'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import apiClient from '@/lib/apiClient';
import { MeetingMinutes } from '@/types/meeting-minutes.type';
import { useQuery } from '@tanstack/react-query';
import { Slash } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { DataTable } from './data-table';
import { columns } from './column';

const MeetingHistory = () => {

    const fetchCurrentMeetingMinutes = async () => {
        const res = await apiClient.get('/meetingminutes/current');
        if (res && res.data) {
            console.log(res.data);
            return res.data;
        }
    }

    const { isLoading, data: meetingMinutes, refetch: refreshMeetingMinutes } = useQuery<MeetingMinutes[]>({
        queryKey: ["meeting-minutes"],
        queryFn: fetchCurrentMeetingMinutes,
    })

    return (
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
                        <BreadcrumbPage>Meeting history</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <DataTable
                columns={columns}
                isLoading={isLoading}
                data={meetingMinutes || []}
            />
        </MainLayout>
    )
}


export default MeetingHistory