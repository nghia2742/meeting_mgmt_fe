import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting.type";
import { format } from "date-fns";
import { Video } from "lucide-react";

const UpcomingMeetings = ({ meetings }: { meetings: Meeting[] }) => {
  // Sort meetings by startTime
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div
      className={`flex flex-1 my-1 ${
        sortedMeetings.length > 0 ? "overflow-x-scroll" : ""
      }`}
    >
      {sortedMeetings.map((meeting) => (
        <Card
          key={meeting.id}
          className='w-[240px] h-[120px] shrink-0 mr-3 hover:cursor-pointer hover:bg-gray-200'
        >
          <div className='flex flex-col p-2 w-full h-full items-start justify-between'>
            <div className='flex w-full justify-between items-start'>
              <Video className='h-10 w-10' />
              <span className='text-xs text-blurGray '>
                {format(new Date(meeting.startTime), "MMMM dd yyyy")}
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
