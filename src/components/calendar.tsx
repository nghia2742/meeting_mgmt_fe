import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

moment.tz.setDefault("UTC");
const localizer = momentLocalizer(moment);

interface CalendarProps {
  meetings: Event[];
  onDateClick: (date: string) => void;
}

const CustomizedCalendar = ({ meetings, onDateClick }: CalendarProps) => {
  const handleSelectSlot = (slotInfo: any) => {
    const selectedDate = new Date(slotInfo.start);
    const utcDate = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
      )
    );
    const formattedDate = utcDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    onDateClick(formattedDate);
  };

  const eventPropGetter = () => {
    return {
      className: "bg-white text-black",
    };
  };

  const EventTooltip = ({ event }: { event: Event }) => (
    <Tooltip>
      <TooltipTrigger>{event.title}</TooltipTrigger>
      <TooltipContent>{event.title}</TooltipContent>
    </Tooltip>
  );

  return (
    <div className='my-9 h-screen'>
      <Calendar
        className='h-[500px]'
        localizer={localizer}
        backgroundEvents={meetings}
        events={meetings}
        startAccessor='start'
        endAccessor='end'
        selectable
        onSelectSlot={handleSelectSlot}
        eventPropGetter={eventPropGetter}
        components={{
          event: EventTooltip,
        }}
      />
    </div>
  );
};

export default CustomizedCalendar;
