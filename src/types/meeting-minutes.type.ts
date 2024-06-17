export type MeetingMinutes = {
    id: string;
    meetingId: string;
    name: string;
    link: string;
    publicId: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
}

export type MeetingMinutesRes = MeetingMinutes & {
    meetingTitle: string;
}