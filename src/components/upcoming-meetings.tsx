import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { DashboardMeeting } from "@/types/meeting.type";
import { format } from "date-fns";
import { Video } from "lucide-react";

const UpcomingMeetings = ({ meetings }: { meetings: DashboardMeeting[] }) => {
  return (
    <div
      className={`flex ${meetings.length > 0 ? "overflow-x-scroll" : ""} my-1`}
    >
      {meetings.map((meeting) => (
        <Card
          key={meeting.id}
          className='w-[240px] h-[120px] shrink-0 mr-3 hover:cursor-pointer hover:bg-gray-200'
        >
          <div className='flex flex-col p-2 w-full h-full items-start justify-between'>
            <div className='flex w-full justify-between items-start'>
              <Video className='h-10 w-10' />
              <span className='text-xs text-blurGray '>
                {format(new Date(meeting.startTime), "MMMM dd")}
              </span>
            </div>
            <div className='line-clamp-1 text-lg'>{meeting.title}</div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default UpcomingMeetings;
