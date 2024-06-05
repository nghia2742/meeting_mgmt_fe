import MainLayout from "@/components/main.layout";
import React, { useEffect, useState } from "react";
import { Users } from "@/types/user.type";
import { getUsers } from "@/apis/user.api";
import withAuth from "@/hoc/withAuth";

function Dashboard() {
  // Example to fetch users
  // const [users, setUsers] = useState<Users | null>(null);
  // useEffect(() => {
  //     getUsers().then((res) => {
  //         setUsers(res.data);
  //     });
  // }, []);
  // console.log(users);

  return (
    <MainLayout>
      <h1>Dashboard</h1>
    </MainLayout>
  );
}

export default withAuth(Dashboard);
