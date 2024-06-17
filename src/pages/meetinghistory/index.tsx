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
import { MeetingMinutesRes } from '@/types/meeting-minutes.type';
import { useQuery } from '@tanstack/react-query';
import { Slash } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'
import { DataTable } from './data-table';
import { columns } from './column';
import useCurrentUser from '@/hooks/useCurrentUser';
import { Button } from '@/components/ui/button';

const MeetingHistory = () => {

    const fetchCurrentMeetingMinutes = async () => {
        const res = await apiClient.get('/meetingminutes/current');
        if (res && res.data) {
            console.log(res.data);
            return res.data;
        }
    }

    const { user } = useCurrentUser();

    const { isLoading, data: meetingMinutes, refetch: refreshMeetingMinutes } = useQuery<MeetingMinutesRes[]>({
        queryKey: ["meeting-minutes"],
        queryFn: fetchCurrentMeetingMinutes,
    });

    const [meetingNameFilter, setMeetingNameFilter] = useState<string | null>(null);
    const filteredMeetingMinutes = meetingNameFilter ? meetingMinutes?.filter(meetingMinute => meetingMinute.meetingTitle === meetingNameFilter) : meetingMinutes;
    const uniqueMeetingNames = Array.from(new Set(meetingMinutes?.map(meetingMinute => meetingMinute.meetingTitle)));

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
            <div className='space-x-2 mb-4'>
                <Button
                    variant={!meetingNameFilter ? "default" : "outline"}
                    size="sm"
                    onClick={() => setMeetingNameFilter(null)}
                >
                    All
                </Button>
                {uniqueMeetingNames.map((meetingName, index) => (
                    <Button
                        key={index}
                        variant={meetingNameFilter === meetingName ? "default" : "outline"}
                        size="sm"
                        onClick={() => setMeetingNameFilter(meetingNameFilter === meetingName ? null : meetingName)}
                    >
                        {meetingName}
                    </Button>
                ))}
            </div>
            <DataTable
                columns={columns(refreshMeetingMinutes, user?.id || '')}
                isLoading={isLoading}
                data={filteredMeetingMinutes || []}
            />
        </MainLayout>
    )
}


export default MeetingHistory