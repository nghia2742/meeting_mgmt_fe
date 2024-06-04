import MainLayout from '@/components/main.layout'
import axios from 'axios';
import React from 'react'
import { columns } from './column';
import type { Meeting } from './column';
import { DataTable } from './data-table';

function Meeting({ meetings: initialMeetings }: { meetings: Meeting[] }) {

    return (
        <MainLayout>
            <div className="container mx-auto py-10">
                <DataTable columns={columns} data={initialMeetings} />
            </div>
        </MainLayout>
    )
}

export async function getServerSideProps() {
    try {
        let response = await axios.get('http://localhost:8000/meetings-fake');
        console.log(response.data);
        return {
            props: {
                meetings: response.data
            }
        }
    } catch (error: any) {
        console.error("Error when fetching data from server: ", error);
    }
}

export default Meeting