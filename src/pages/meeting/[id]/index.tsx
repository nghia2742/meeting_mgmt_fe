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
import { Slash } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { AttendeeList } from '@/components/meetingDetail/attendeelist/AttendeeList'
import FileList from '@/components/meetingDetail/fileList/FileList'
import AddNewAttendee from '@/components/modal/AddNewAttendee'
import AddNewFile from '@/components/modal/AddNewFile'
import PreviewMeetingMinute from '@/components/modal/PreviewMeetingMinute'
import { Attendee } from '@/types/attendee.type'
import { MeetingFile } from '@/types/meeting.file.type'
import { MeetingMinutes } from '@/types/meeting-minutes.type'
import ErrorMessage from '@/components/error/ErrorMessage'
import useCurrentUser from '@/hooks/useCurrentUser'
import useCreatedBy from '@/hooks/useCreatedBy'

interface MeetingDetailPageProps {
    meeting: Meeting;
    statusCode?: number;
}

const MeetingDetail: React.FC<MeetingDetailPageProps> = ({ meeting: initialMeeting, statusCode }) => {

    if (statusCode) {
        console.log(statusCode);
        if (statusCode === 500) {
            return (
                <MainLayout>
                    <ErrorMessage
                        title="Not found this meeting"
                        img="/images/notfound.png"
                    />
                </MainLayout>
            )
        }
        if (statusCode === 403) {
            return (
                <MainLayout>
                    <ErrorMessage
                        title="You can't access this meeting"
                        content="Please make sure you're assinged to this meeting"
                        img="/images/restricted-area.png"
                    />
                </MainLayout>
            )
        }
        return (
            <MainLayout>
                Error
            </MainLayout>
        )
    }

    const [meeting, setMeeeting] = useState(initialMeeting);
    const { formattedDate, formattedTime } = formatDateTime(meeting.startTime.toString());
    const minutes = calcMinutes(meeting.startTime.toString(), meeting.endTime.toString());
    const [isOpenModalAddAttendee, setIsOpenModalAddAttendee] = useState(false);
    const [isOpenModalAddFile, setIsOpenModalAddFile] = useState(false);
    const [isOpenPreviewMeeetingMinute, setIsOpenPreviewMeeetingMinute] = useState(false);
    const [attendees, setAttendees] = useState<Attendee[]>();
    const [files, setFiles] = useState<MeetingFile[]>();
    const [users, setUsers] = useState<Attendee[]>();
    const [latestMeetingMinutes, setLatestMeetingMinutes] = useState<MeetingMinutes>();
    const { user } = useCurrentUser();
    const { user: userCreated } = useCreatedBy(meeting.createdBy);

    const fetchMeeting = async () => {
        let response = await apiClient.get(`/meetings/${initialMeeting.id}`);
        if (response && response.data) {
            setMeeeting(response.data);
        }
    }

    const fetchAttendees = useCallback(async () => {
        const res = await apiClient.get(`/usermeetings/attendees/${meeting.id}`);
        if (res && res.data) {
            setAttendees(res.data);
        }
    }, []);

    const fetchAllUser = useCallback(async () => {
        const res = await apiClient.get(`/users`);
        if (res && res.data) {
            setUsers(res.data);
        }
    }, []);

    const fetchFiles = useCallback(async () => {
        const res = await apiClient.get(`/files/${meeting.id}`);
        if (res && res.data) {
            setFiles(res.data);
        }
    }, []);

    const fetchLatestMeetingMinutes = useCallback(async () => {
        const res = await apiClient.get(`/meetingminutes/latest/${meeting.id}`);
        if (res && res.data) {
            setLatestMeetingMinutes(res.data);
        }
    }, []);

    useEffect(() => {
        fetchAttendees();
        fetchAllUser();
        fetchFiles();
        fetchLatestMeetingMinutes();
    }, []);

    return (
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
                                    <p className='font-bold text-xl'>{meeting.title}</p>
                                    <div className="flex text-sm items-center space-x-3">
                                        <p className='font-bold'>Date: {formattedDate}</p>
                                        <p>|</p>
                                        <p className='font-bold'>Start time: {formattedTime}</p>
                                        <div className='rounded-lg px-2 py-1 text-[12px] bg-black text-white'>{minutes} minutes</div>
                                    </div>
                                    <div className="flex text-sm items-center space-x-3">
                                        <p>Location: {meeting.location}</p>
                                        <p>|</p>
                                        <p>Organised by: {userCreated?.fullName}</p>
                                    </div>
                                    <p className="text-gray-700">{meeting.description}</p>
                                    <div className="lg:flex lg:space-x-4 space-y-4 lg:space-y-0">
                                        <Button className='text-[13px] w-full lg-w-auto' variant={"secondary"}>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={latestMeetingMinutes?.link}
                                            >
                                                View meeting minutes
                                            </a>
                                        </Button>
                                        {user?.id === meeting.createdBy ?
                                            <Button
                                                className='text-[13px] w-full lg-w-auto'
                                                onClick={() => setIsOpenPreviewMeeetingMinute(true)}
                                            >
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
                                                className='text-[13px]'
                                                onClick={() => setIsOpenModalAddAttendee(true)}
                                            >
                                                Add new attendee
                                            </Button> : ''
                                        }
                                    </div>
                                    <AttendeeList
                                        attendees={attendees || []}
                                        meetingId={meeting.id}
                                        refreshData={() => fetchAttendees()}
                                        canHaveActions={user?.id === meeting.createdBy}
                                    />
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className="flex items-center justify-between">
                                    <p className='font-bold text-xl'>Files</p>
                                    <Button
                                        className='text-[13px]'
                                        onClick={() => setIsOpenModalAddFile(true)}
                                    >
                                        Add new file
                                    </Button>
                                </div>
                                <FileList
                                    files={files || []}
                                    meetingId={meeting.id}
                                    refreshData={() => fetchFiles()}
                                    currentUserId={user?.id}
                                />
                            </div>
                        </div>
                    </div>
                    <AddNewAttendee
                        isOpen={isOpenModalAddAttendee}
                        onClose={() => setIsOpenModalAddAttendee(false)}
                        onAddAttendees={() => fetchAttendees()}
                        attendees={users}
                        meetingId={meeting.id}
                    />
                    <AddNewFile
                        isOpen={isOpenModalAddFile}
                        onClose={() => setIsOpenModalAddFile(false)}
                        onAddFile={() => fetchFiles()}
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
    )
}

export async function getServerSideProps({ req, params }: any) {
    try {
        const { id } = params;
        let response = await apiClient.get(`/meetings/${id}`, {
            headers: {
                Cookie: req.headers.cookie
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