import MainLayout from "@/components/main.layout";
import React from "react";
import { columns } from "./column";
import { DataTable } from "./data-table";
import apiClient from "@/lib/apiClient";
import type { Meeting } from "@/types/meeting.type";


interface MeetingPageProps {
  meetings: Meeting[];
}

const Meeting: React.FC<MeetingPageProps> = ({ meetings: initialMeetings }) => {
  return (
    <MainLayout>
      <div className='container mx-auto py-10'>
        <DataTable columns={columns} data={initialMeetings} />
      </div>
    </MainLayout>
  );
};

export async function getServerSideProps({ req }: any) {
  try {
    let response = await apiClient.get("/meetings/current", {
      headers: {
        Cookie: req.headers.cookie
      }
    });
    return {
      props: {
        meetings: response.data,
      },
    };
  } catch (error: any) {
    console.error("Error when fetching data from server: ", error.response.data.message);
    return {
      props: {
        meetings: [], // or you can return any default/fallback value
        error: 'Failed to fetch meetings data', // optional: pass an error message
      },
    };
  }
}

export default Meeting;
