import { MeetingCategory } from "./enums/meeting.enum";

export interface Meeting {
  title: string;
  type: MeetingCategory;
  description: string;
  note: string;
  startTime: Date;
  endTime: Date;
  location: string;
}
