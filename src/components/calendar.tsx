import { useState } from "react";
import {
  Calendar,
  momentLocalizer,
  Event,
  View,
  ToolbarProps,
} from "react-big-calendar";
import moment from "moment-timezone";
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

moment.tz.setDefault("UTC");
const localizer = momentLocalizer(moment);

interface CalendarProps {
  meetings: Event[];
  onDateClick: (date: string) => void;
}

const CustomizedToolbar = (props: ToolbarProps) => {
  const goToBack = () => {
    props.onNavigate("PREV");
  };

  const goToNext = () => {
    props.onNavigate("NEXT");
  };

  const goToCurrent = () => {
    props.onNavigate("TODAY");
  };

  const goToPreviousYear = () => {
    const date = moment(props.date).subtract(1, "year").toDate();
    props.onNavigate("DATE", date);
  };

  const goToNextYear = () => {
    const date = moment(props.date).add(1, "year").toDate();
    props.onNavigate("DATE", date);
  };

  const label = () => {
    const date = moment(props.date);
    switch (props.view) {
      case "month":
      case "week":
        return (
          <span className='text-lg font-bold'>{date.format("MMMM YYYY")}</span>
        );
      case "day":
        return (
          <span className='text-lg font-bold'>
            {date.format("MMMM DD, YYYY")}
          </span>
        );
      default:
        return (
          <span className='text-lg font-bold'>{date.format("MMMM YYYY")}</span>
        );
    }
  };

  const handleViewChange = (view: View) => {
    props.onView(view);
  };

  return (
    <div className='flex flex-col md:flex-row justify-between items-center mb-4 '>
      <div>
        <Button
          variant='outline'
          onClick={goToBack}
          className='rounded-r-none hover:bg-customGray '
        >
          Back
        </Button>
        <Button
          variant='outline'
          onClick={goToCurrent}
          className='rounded-none hover:bg-customGray '
        >
          Today
        </Button>
        <Button
          variant='outline'
          onClick={goToNext}
          className='rounded-l-none hover:bg-customGray'
        >
          Next
        </Button>
      </div>
      <div className='text-center my-2 md:my-0'>
        <button
          onClick={goToPreviousYear}
          className='hover:font-bold transition-colors'
        >
          {"<<"}
        </button>
        <span className='mx-4'>{label()}</span>
        <button
          onClick={goToNextYear}
          className='hover:font-bold transition-colors'
        >
          {">>"}
        </button>
      </div>
      <div className='flex'>
        {["month", "week", "day", "agenda"].map((viewToolbar) => (
          <Button
            key={viewToolbar}
            variant='outline'
            onClick={() => handleViewChange(viewToolbar as View)}
            className={`rounded-none first:rounded-l last:rounded-r hover:bg-customGray ${
              props.view === viewToolbar
                ? "bg-customGray shadow-inset-custom"
                : ""
            }`}
          >
            {viewToolbar.charAt(0).toUpperCase() + viewToolbar.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
};

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
          toolbar: CustomizedToolbar,
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
