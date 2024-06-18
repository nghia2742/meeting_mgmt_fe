import MainLayout from '@/components/main.layout';
import React, { useState, useEffect } from 'react';
import { DataTableDemo } from './data-table';
import { Search as SearchIcon, Filter as FilterIcon, Calendar as CalendarIcon, List as ListIcon, LayoutGridIcon, Slash } from "lucide-react";
import { Button } from '@/components/ui/button';
import CreateUserModal from './components/CreateUserModal';
import { getUser, searchUsersByEmail, updateUserProfile } from '@/lib/apiUser';
import { UserProfile } from '@/types/userProfile.type';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';

function User() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchUsers = async () => {
        try {
            const userData = await getUser();
            setUsers(userData);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchTerm.trim() === "") {
            fetchUsers();
        } else {
            try {
                const userData = await searchUsersByEmail(searchTerm);
                setUsers(userData);
            } catch (error) {
                console.error("Error searching users:", error);
            }
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <MainLayout>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                        <Slash />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Users</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="container mx-auto py-10 w-full overflow-hidden">
                <h1 className="text-2xl font-bold text-gray-800">User</h1>
                <div className="flex flex-wrap mt-4 items-center justify-between">
                    <div className="flex items-center flex-grow space-x-4">
                        <form className="flex-grow max-w-xs sm:max-w-none mr-1" onSubmit={handleSearch}>
                            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                            <div className="relative flex items-center gap-2">
                                <button type="submit" className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <SearchIcon />
                                </button>
                                <input
                                    type="search"
                                    id="default-search"
                                    className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Button variant="outline" className="flex-shrink-0"><FilterIcon className='w-4 h-4 mr-2 ' /> Filter</Button>

                            </div>
                        </form>
                    </div>
                    <div className="flex space-x-4 mt-4 ml-[520px] rounded-md shadow-sm sm:mt-0">
                        <button className="p-2 rounded hover:bg-gray-200 bg-muted text-primary"><ListIcon /></button>
                        <button className="p-2 rounded hover:bg-gray-200"><LayoutGridIcon /></button>
                        <button className="p-2 rounded hover:bg-gray-200"><CalendarIcon /></button>
                    </div>
                </div>
            </div>
            <div className="container mx-auto py-10 w-full overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <div></div> {/* This empty div helps push the button to the right */}
                    <Button className="w-[100px] h-[50px]" onClick={openModal}> <CalendarIcon />Create User</Button>
                </div>
                <DataTableDemo users={users} setUsers={setUsers} />
            </div>
            <CreateUserModal isOpen={isModalOpen} onClose={closeModal} onUserCreated={fetchUsers} />
        </MainLayout>
    );
}

export default User;
