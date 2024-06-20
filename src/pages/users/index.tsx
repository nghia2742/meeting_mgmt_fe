import MainLayout from "@/components/main.layout";
import React, { useState, useEffect } from "react";
import { DataTableDemo } from "./data-table";
import { Plus, Search as SearchIcon, Slash } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreateUserModal from "./components/CreateUserModal";
import { getUser, searchUsersByEmail } from "@/lib/apiUser";
import { UserProfile } from "@/types/userProfile.type";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import Head from "next/head";

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
    <>
      <Head>
        <title>User</title>
      </Head>
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
              <BreadcrumbPage>User</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="container mx-auto py-10">
          <div className="flex items-center justify-between gap-2 py-4">
            <form className="flex-grow w-full sm:w-auto" onSubmit={handleSearch}>
              <div className="relative flex items-center">
                <button type="submit" className="absolute left-0 pl-3">
                  <SearchIcon />
                </button>
                <input
                  type="search"
                  id="default-search"
                  className="block w-96 p-2.5 pl-10 text-sm border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
            <Button onClick={openModal}><Plus className='h-4- w-4 md:mr-2'/> Create User</Button>
          </div>
          <div className="rounded-md ">
            <DataTableDemo users={users} setUsers={setUsers} />
          </div>
        </div>
        <CreateUserModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onUserCreated={fetchUsers}
        />
      </MainLayout>
    </>
  );
}

export default User;
