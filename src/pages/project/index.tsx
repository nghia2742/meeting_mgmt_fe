import MainLayout from '@/components/main.layout';
import React from 'react';
import { DataTableDemo } from './data-table';
import { Search as SearchIcon } from 'lucide-react';
import Head from 'next/head';

function Project() {
    return (
        <>
            <Head>
                <title>Project</title>
            </Head>
            <MainLayout>
                <div className="container mx-auto w-full overflow-hidden">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Project
                    </h1>
                    <div className="flex flex-wrap mt-4 items-center justify-between">
                        <div className="flex items-center flex-grow space-x-4">
                            <form className="flex-grow max-w-xs sm:max-w-none">
                                <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
                                    Search
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <SearchIcon />
                                    </div>
                                    <input
                                        type="search"
                                        id="default-search"
                                        className="block w-[300px] px-4 py-2 text-sm pl-10 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
                                        placeholder="Search..."
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto py-5 w-full overflow-hidden">
                    <DataTableDemo />
                </div>
            </MainLayout>
        </>
    );
}

export default Project;
