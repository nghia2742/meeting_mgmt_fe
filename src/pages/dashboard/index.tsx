import MainLayout from "@/components/main.layout";
import { Meeting } from "@/types/meeting.type";
import { DashboardDataTable } from "./data-table";
import { dashboardColumns } from "./column";
import UpcomingMeetings from "@/components/upcoming-meetings";
import CustomizedCalendar from "@/components/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { isFutureDate } from "@/utils/time-picker.util";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import Head from "next/head";
import { CalendarDays, Table } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAllMeeting } from "@/hooks/useMeeting";

function Dashboard() {
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState("");

  const { isLoading, isError, error, data: meetings } = useAllMeeting();

  useEffect(() => {
    if (meetings) {
      setFilteredMeetings(meetings);
    }
  }, [meetings]);

  if (isError) {
    toast({
      title: "Uh oh! Error",
      description: error.message,
      variant: "destructive",
    });
  }

  const handleSetAllMeetings = () => {
    setFilteredMeetings(meetings || []);
    setSelectedDate("");
  };

  const handleDateClick = (date: string) => {
    console.log("Selected date:", date);
    if (meetings) {
      setSelectedDate(date);
      setFilteredMeetings(
        meetings.filter((meeting) => {
          const meetingDate = meeting.startTime.toISOString().split("T")[0];
          return meetingDate === date;
        })
      );
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <MainLayout>
        <div className='w-full px-1 lg:w-dashboard-full overflow-x-hidden'>
          {meetings && (
            <UpcomingMeetings
              meetings={
                meetings?.filter((meeting) =>
                  isFutureDate(new Date(meeting.startTime))
                ) ?? []
              }
            />
          )}
          <Tabs defaultValue='calendar' className='w-full mt-9'>
            <TabsList>
              <TabsTrigger value='calendar'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CalendarDays className='h-4 w-4' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Calendar</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
              <TabsTrigger value='table'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Table className='h-4 w-4' />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Table</p>
                  </TooltipContent>
                </Tooltip>
              </TabsTrigger>
            </TabsList>
            <TabsContent value='calendar'>
              <CustomizedCalendar
                meetings={
                  meetings?.map((meeting) => ({
                    title: meeting.title,
                    start: new Date(meeting.startTime),
                    end: new Date(meeting.endTime),
                  })) ?? []
                }
                onDateClick={handleDateClick}
              />
            </TabsContent>
            <TabsContent value='table'>
              <DashboardDataTable
                columns={dashboardColumns}
                data={filteredMeetings}
                selectedDate={selectedDate}
                isLoading={isLoading}
                onSetAllMeetings={handleSetAllMeetings}
              />
            </TabsContent>
          </Tabs>
        </div>
      </MainLayout>
    </>
  );
}

export default Dashboard;
