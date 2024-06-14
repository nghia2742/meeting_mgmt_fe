import { Calendar, momentLocalizer, Event, View } from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";

moment.tz.setDefault("UTC");
const localizer = momentLocalizer(moment);

interface CalendarProps {
  meetings: Event[];
  onDateClick: (date: string) => void;
}

const CustomizedCalendar = ({ meetings, onDateClick }: CalendarProps) => {
  const [view, setView] = useState<View>("month");
  const [date, setDate] = useState<Date>(new Date());

  const handleSelectSlot = (slotInfo: any) => {
    const selectedDate = new Date(slotInfo.start);
    const utcDate = new Date(
      Date.UTC(
        selectedDate.getUTCFullYear(),
        selectedDate.getUTCMonth(),
        selectedDate.getUTCDate()
      )
    );
    setDate(utcDate);
    const formattedDate = utcDate.toISOString().split("T")[0]; // 'YYYY-MM-DD'
    onDateClick(formattedDate);
    setView("day");
  };

  const handleDrillDown = (d: Date, currentView: View) => {
    setDate(d);
    setView("day");
  };

  const eventPropGetter = () => {
    return {
      className: "bg-white text-black",
    };
  };

  const dayPropGetter = () => {
    return {
      className: "cursor-pointer",
    };
  };

  const EventWrapper = ({ event }: { event: Event }) => (
    <div className='bg-blurGray text-white px-1 rounded flex items-center'>
      <Tooltip>
        <TooltipTrigger>
          <span className='text-xs'>{event.title}</span>
        </TooltipTrigger>
        <TooltipContent>{event.title}</TooltipContent>
      </Tooltip>
    </div>
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
        dayPropGetter={dayPropGetter}
        components={{
          eventWrapper: EventWrapper,
        }}
        view={view}
        date={date}
        onView={(view: View) => setView(view)}
        onNavigate={(newDate) => setDate(newDate)}
        onDrillDown={handleDrillDown}
      />
    </div>
  );
};

export default CustomizedCalendar;
