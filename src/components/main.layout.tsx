import Link from "next/link";
import { CircleUser, Home, Package, Package2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReactNode, useEffect, useState } from "react";

import Image from "next/image";
import { Inter } from "next/font/google";
import Sidebar from "./sidebar";
import SidebarMobile from "./sidebar-mobile";
import SettingsModal from "./modal/settingModal";
import useLogout from "@/hooks/useLogout";
import useUserStore from "@/stores/userStore";

const inter = Inter({ subsets: ["latin"] });

export function MainLayout({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userProfile, fetchUserProfile } = useUserStore((state) => ({
    userProfile: state.userProfile,
    fetchUserProfile: state.fetchUserProfile,
  }));
  const { mutate: logout } = useLogout();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!userProfile) {
      fetchUserProfile();
    }
  }, [fetchUserProfile, userProfile]);

  return (
    <div
      className={`grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ${inter.className}`}
    >
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center justify-center px-4 lg:h-[100px] lg:px-6">
            {/* LOGO */}
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Image
                src="/images/logoCLT.png"
                width={100}
                height={100}
                priority={true}
                alt="Logo CLT"
              />
            </Link>
          </div>
          <div className="flex-1">
            <Sidebar />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <SidebarMobile />
          <div className="w-full flex-1"></div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                className="flex items-center gap-4 p-0"
              >
                {userProfile?.avatar ? (
                  <Image
                    src={userProfile.avatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <CircleUser className="w-10 h-10" />
                )}
                <div className="font-medium dark:text-white">
                  <div>{userProfile?.fullName}</div>
                  
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userProfile?.fullName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={openModal}>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
      <SettingsModal isOpen={isModalOpen} onClose={closeModal}></SettingsModal>
    </div>
  );
}

export default MainLayout;
