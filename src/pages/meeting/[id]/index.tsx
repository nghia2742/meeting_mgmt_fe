import MainLayout from '@/components/main.layout'
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
    BreadcrumbPage
} from '@/components/ui/breadcrumb'
import apiClient from '@/lib/apiClient'
import { Meeting } from '@/types/meeting.type'
import { calcMinutes, formatDateTime } from '@/utils/datetime.util'
import { Eye, FilePlus2, Slash, UserRoundPlus, History, Video } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AttendeeList } from '@/components/meetingDetail/attendeelist/AttendeeList'
import FileList from '@/components/meetingDetail/fileList/FileList'
import AddNewAttendee from '@/components/modal/AddNewAttendee'
import AddNewFile from '@/components/modal/AddNewFile'
import PreviewMeetingMinute from '@/components/modal/PreviewMeetingMinute'
import { MeetingMinutes } from '@/types/meeting-minutes.type'
import useCurrentUser from '@/hooks/useCurrentUser'
import useCreatedBy from '@/hooks/useCreatedBy'
import Head from 'next/head';
import { Separator } from '@/components/ui/separator'
import EditMeeting from '@/components/modal/EditMeeting'
import { useAllFiles } from '@/hooks/useFile'
import { useAttendees } from '@/hooks/useAttendee'
import { useAllUser } from '@/hooks/useUser'
import ErrorMeetingDetail from '@/components/error/ErrorMeetingDetail'
import { getCookieValue } from '@/utils/cookie.util'

interface MeetingDetailPageProps {
    meeting: Meeting;
    statusCode?: number;
}

const MeetingDetail: React.FC<MeetingDetailPageProps> = ({ meeting: initialMeeting, statusCode }) => {

    const [meeting, setMeeeting] = useState(initialMeeting || {});
    const { formattedDate, formattedTime } = formatDateTime(meeting ? meeting?.startTime?.toString() : '');
    const minutes = calcMinutes(meeting && meeting?.startTime?.toString(), meeting && meeting?.endTime?.toString());
    const [isOpenModalAddAttendee, setIsOpenModalAddAttendee] = useState(false);
    const [isOpenModalAddFile, setIsOpenModalAddFile] = useState(false);
    const [isOpenPreviewMeeetingMinute, setIsOpenPreviewMeeetingMinute] = useState(false);
    const [latestMeetingMinutes, setLatestMeetingMinutes] = useState<MeetingMinutes>();
    const { user } = useCurrentUser();
    const { user: userCreated } = useCreatedBy(meeting ? meeting.createdBy : '');

    if (statusCode) {
        return <ErrorMeetingDetail statusCode={statusCode} />
    }

    const { isLoading: isLoadingFiles, data: files, refetch: refreshFiles } = useAllFiles(meeting.id);
    const { isLoading: isLoadingAttendees, data: attendees, refetch: refreshAttendees } = useAttendees(meeting.id);
    const { data: users } = useAllUser();

    const fetchMeeting = async () => {
        let response = await apiClient.get(`/meetings/${initialMeeting.id}`);
        if (response && response.data) {
            setMeeeting(response.data);
        }
    }

    const fetchLatestMeetingMinutes = async () => {
        const res = await apiClient.get(`/meetingminutes/latest/${meeting.id}`);
        if (res && res.data) {
            setLatestMeetingMinutes(res.data);
        } else {
            setLatestMeetingMinutes(undefined);
        }
    };

    useEffect(() => {
        fetchLatestMeetingMinutes();
    }, []);

    return (
        <>
            <Head>
                <title>Meeting detail</title>
            </Head>
            <MainLayout>
                {meeting ?
                    <>
                        <div className='space-y-10 px-4'>
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href='/dashboard'>Home</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <Slash />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href='/meeting'>Meeting</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <Slash />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>Meeting detail</BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                            <div className="space-y-4">
                                <div className="space-x-0 space-y-10 lg:space-y-0 lg:flex lg:space-x-20">
                                    <div className="space-y-4 text-sm w-[100%] lg:w-[50%]">
                                        <div className="relative flex items-center space-x-2">
                                            <Video className="h-5 w-5" />
                                            <p className='font-bold text-xl'>{meeting.title}</p>
                                            {meeting.tag.split(', ').map((tagItem: string, index: number) => (
                                                <div key={index} className='px-3 py-0.5 rounded-full text-[10px] text-black border border-black'>#{tagItem}</div>
                                            ))}
                                            {user?.id === meeting.createdBy ?
                                                <div className='absolute top-0 right-0'>
                                                    <EditMeeting meeting={meeting} />
                                                </div>
                                                : ''}

                                        </div>
                                        <div className="flex text-sm items-center space-x-3">
                                            <p className='font-bold'>Date: {formattedDate}</p>
                                            <Separator
                                                orientation='vertical'
                                                className='h-4 mx-2 border-l border-black'
                                            />
                                            <p className='font-bold'>Start time: {formattedTime}</p>
                                            <div className='flex items-center gap-2 rounded-lg px-2 py-1 text-[12px] bg-black text-white'>
                                                {minutes} minutes
                                                <History className='w-4 h-4' />
                                            </div>
                                        </div>
                                        <div className="flex text-sm items-center space-x-3">
                                            <p>Location: {meeting.location}</p>
                                            <Separator
                                                orientation='vertical'
                                                className='h-4 mx-2 border-l border-black'
                                            />
                                            <p>Organised by: {userCreated?.fullName}</p>
                                        </div>
                                        <p className="text-gray-700 text-[13px]">{meeting.description}</p>
                                        {meeting.note &&
                                            <div className="text-gray-700 text-[13px] flex items-center space-x-1">
                                                <p className='text-red-500'>*</p>
                                                <p>Notes: {meeting.note}</p>
                                            </div>
                                        }
                                        <div className="lg:flex lg:space-x-4 space-y-4 lg:space-y-0">
                                            {latestMeetingMinutes &&
                                                <Button className='text-[13px] w-full lg-w-auto p-0' variant={"secondary"}>
                                                    <a
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        href={latestMeetingMinutes?.link}
                                                        className='w-full h-full flex items-center gap-2 justify-center'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                        View meeting minutes
                                                    </a>
                                                </Button>
                                            }
                                            {user?.id === meeting.createdBy ?
                                                <Button
                                                    className='text-[13px] w-full lg-w-auto flex items-center gap-2'
                                                    onClick={() => setIsOpenPreviewMeeetingMinute(true)}
                                                >
                                                    <FilePlus2 className='w-4 h-4' />
                                                    Create meeting minutes
                                                </Button>
                                                : ''}

                                        </div>
                                    </div>
                                    <div className='w-[100%] lg:w-[50%] space-y-4'>
                                        <div className="flex items-center justify-between">
                                            <p className='font-bold text-xl'>Attendees</p>
                                            {user?.id === meeting.createdBy ?
                                                <Button
                                                    className='text-[13px] flex items-center gap-2'
                                                    onClick={() => setIsOpenModalAddAttendee(true)}
                                                >
                                                    <UserRoundPlus className='w-4 h-4' />
                                                    Add new attendee
                                                </Button> : ''
                                            }
                                        </div>
                                        <AttendeeList
                                            attendees={attendees}
                                            meetingId={meeting.id}
                                            refreshData={refreshAttendees}
                                            canHaveActions={user?.id === meeting.createdBy}
                                            isLoading={isLoadingAttendees}
                                        />
                                    </div>
                                </div>
                                <div className='space-y-4'>
                                    <div className="flex items-center justify-between">
                                        <p className='font-bold text-xl'>Files</p>
                                        <Button
                                            className='text-[13px] flex items-center gap-2'
                                            onClick={() => setIsOpenModalAddFile(true)}
                                        >
                                            <FilePlus2 className='w-4 h-4' />
                                            Add new file
                                        </Button>
                                    </div>
                                    <FileList
                                        files={files || []}
                                        meetingId={meeting.id}
                                        refreshData={refreshFiles}
                                        currentUserId={user?.id}
                                        isLoading={isLoadingFiles}
                                    />
                                </div>
                            </div>
                        </div>
                        <AddNewAttendee
                            isOpen={isOpenModalAddAttendee}
                            onClose={() => setIsOpenModalAddAttendee(false)}
                            onAddAttendees={refreshAttendees}
                            attendees={users}
                            meetingId={meeting.id}
                        />
                        <AddNewFile
                            isOpen={isOpenModalAddFile}
                            onClose={() => setIsOpenModalAddFile(false)}
                            onAddFile={refreshFiles}
                            meetingId={meeting.id}
                        />
                        <PreviewMeetingMinute
                            isOpen={isOpenPreviewMeeetingMinute}
                            onClose={() => { setIsOpenPreviewMeeetingMinute(false); fetchLatestMeetingMinutes() }}
                            meeting={meeting}
                            attendees={attendees || []}
                            files={files || []}
                            refreshMeeting={fetchMeeting}
                        />
                    </> : <p>You can't view this meeting</p>
                }
            </MainLayout>
        </>
    )
}

export async function getServerSideProps({ req, params }: any) {
    try {
        const { id } = params;
        if (!id) {
            throw new Error("ID is missing or undefined");
        }
        const { cookie } = req.headers;
        const accessToken = getCookieValue(cookie, "accessToken");
        let response = await apiClient.get(`/meetings/${id}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return {
            props: {
                meeting: response.data,
            },
        };
    } catch (error: any) {
        console.error("Error when fetching data from server: ", error);
        return {
            props: {
                meeting: {}, // or you can return any default/fallback value
                statusCode: error.response.data.statusCode, // optional: pass an error message
            },
        };
    }
}

export default MeetingDetail