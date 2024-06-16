import { Card } from "@/components/ui/card";
import { Meeting } from "@/types/meeting.type";
import { format } from "date-fns";
import { Video } from "lucide-react";
import Link from "next/link";

const UpcomingMeetings = ({ meetings }: { meetings: Meeting[] }) => {
  // Sort meetings by startTime
  const sortedMeetings = [...meetings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );

  return (
    <div className='flex-1 my-1'>
      <h1 className='mb-4 text-xl font-bold'>Upcoming Meetings</h1>
      <div className='flex w-full overflow-x-auto py-2'>
        {sortedMeetings.map((meeting) => (
          <Card
            key={meeting.id}
            className='w-[200px] h-[100px] border-gray-800 transition-all shrink-0 mr-3 p-2 last:mr-0 hover:cursor-pointer hover:bg-gray-200'
          >
            <Link
              href={`/meeting/${meeting.id}`}
              className='flex flex-col w-full h-full items-start justify-between'
            >
              <div className='flex w-full justify-between items-start'>
                <Video className='h-11 w-11' />
                <span className='text-xs text-blurGray '>
                  {format(new Date(meeting.startTime), "MMMM dd yyyy")}
                </span>
              </div>
              <div className='line-clamp-1 text-sm'>{meeting.title}</div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeetings;
