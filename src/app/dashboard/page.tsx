import React from "react";

import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/next-auth";
import QuizCard from "./QuizCard/QuizCard";
import HistoryCard from "./HistoryCard/HistoryCard";
import FamousTopics from "./FamousTopics/FamousTopics";
import RecentActivites from "./RecentActivites/RecentActivites";

export const metadata = {
    title: "Dashboard - Quizora",
}

const Dashboard = async () => {

    const session = await getAuthSession();
    if(!session?.user) {
        return redirect("/");
    }

  return (
    <main className="p-8 mx-auto max-w-7xl">
        <div className="flex items-center">
            <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashborad</h2>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-2">
            <QuizCard />
            <HistoryCard />
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-2">
            <FamousTopics />
            <RecentActivites />
        </div>
    </main>
  );
}

export default Dashboard;