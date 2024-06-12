import { useEffect, useState } from "react";
import MainLayout from "@/components/main.layout";
import { DashboardMeeting } from "@/types/meeting.type";
import { MeetingCategory } from "@/types/enums/meeting.enum";
import { DashboardDataTable } from "./data-table";
import { dashboardColumns } from "./column";
import { useDeleteMeeting } from "@/hooks/useMeeting";
import UpcomingMeetings from "@/components/upcoming-meetings";
import { isFutureDate } from "@/utils/time-picker.util";

const meetings: DashboardMeeting[] = [
  {
    id: "1",
    title: "Meeting 1",
    type: MeetingCategory.PROJECT_KICKOFF,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Paris 6F",
  },
  {
    id: "2",
    title: "Meeting 2",
    type: MeetingCategory.PLANNING,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Singapore 5F",
  },
  {
    id: "3",
    title: "Meeting 3",
    type: MeetingCategory.PROJECT_KICKOFF,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2025-06-11T12:40:18.982"),
    endTime: new Date("2025-06-11T13:40:18.982"),
    location: "Rafah 2F",
  },
  {
    id: "4",
    title: "Meeting 4",
    type: MeetingCategory.TRAINING,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Tel Aviv 6F",
  },
  {
    id: "5",
    title: "Meeting 5",
    type: MeetingCategory.PROJECT_KICKOFF,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Madrid 6F",
  },
  {
    id: "6",
    title: "Meeting 6",
    type: MeetingCategory.CLIENT,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Beijing 6F",
  },
  {
    id: "7",
    title: "Meeting 7",
    type: MeetingCategory.PERFORMANCE_REVIEW,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "London 6F",
  },
  {
    id: "8",
    title: "Meeting 8",
    type: MeetingCategory.PROBLEM_SOLVING,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Amsterdam 2F",
  },
  {
    id: "9",
    title: "Meeting 9",
    type: MeetingCategory.PROJECT_KICKOFF,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Harbin 5F",
  },
  {
    id: "10",
    title: "Meeting 10",
    type: MeetingCategory.REGULAR_TEAM,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Kyiv 6F",
  },
  {
    id: "11",
    title: "Meeting 11",
    type: MeetingCategory.STATUS_UPDATE,
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    note: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt dolorem repellendus eligendi excepturi animi omnis soluta minima, ducimus culpa doloremque ab, totam sit quo cumque. Vero repellat quos tenetur reprehenderit!",
    startTime: new Date("2024-06-01T12:40:18.982"),
    endTime: new Date("2024-06-01T13:40:18.982"),
    location: "Moscow 5F",
  },
];

function Dashboard() {
  const [selectedMeetings, setSelectedMeetings] = useState<DashboardMeeting[]>(
    []
  );
  const { mutate: deleteMeeting } = useDeleteMeeting();

  const onDeleteMeetings = async () => {
    await Promise.all(
      selectedMeetings.map((meeting) => deleteMeeting(meeting.id))
    );
  };

  return (
    <MainLayout>
      <div className='max-w-[1020px] overflow-x-hidden'>
        <UpcomingMeetings
          meetings={meetings.filter((meeting) =>
            isFutureDate(meeting.startTime)
          )}
        />
        <DashboardDataTable
          columns={dashboardColumns}
          data={meetings}
          isLoading={false}
          selectedItems={selectedMeetings}
          setSelectedItems={setSelectedMeetings}
          handleDeleteItems={onDeleteMeetings}
        />
      </div>
    </MainLayout>
  );
}

export default Dashboard;
