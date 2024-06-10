import { MeetingCategory } from "./enums/meeting.enum";

export type Meeting = {
  id: string;
  title: string;
  type: string;
  description: string;
  note: string;
  startTime: Date;
  endTime: Date;
  location: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
};

export type DashboardMeeting = {
  id: string;
  title: string;
  type: MeetingCategory;
  description: string;
  note: string;
  startTime: Date;
  endTime: Date;
  location: string;
};
