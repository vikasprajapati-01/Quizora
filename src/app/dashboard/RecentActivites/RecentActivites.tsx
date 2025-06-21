"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdHistory } from "react-icons/md";
import Link from "next/link";

type Props = {
  games_count?: number;
};

const RecentActivities = ({ games_count = 0 }: Props) => {
  const router = useRouter();
  
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2F2B2B] hover:shadow-lg hover:shadow-[#ff7f01]/10 transition-all duration-300 hover:border-[#ff7f01]/50 hover:scale-[1.02] group overflow-hidden h-full w-full">
      <div className="p-5 sm:p-6 md:p-7">
        <div className="flex flex-row items-center justify-between pb-3 sm:pb-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-white group-hover:text-[#ff7f01] transition-colors duration-300">
            <Link href="/history">Recent Activity</Link>
          </h3>
          <div className="p-2 sm:p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/20 group-hover:bg-[#ff7f01]/20 group-hover:scale-110 transition-all duration-300">
            <MdHistory size={24} className="text-[#ff7f01] transition-transform group-hover:rotate-12 duration-300" />
          </div>
        </div>
        
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed pt-1 pb-3">
          You have played a total of {games_count} quizzes.
        </p>
        
        <div className="pl-2">
          Histories
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;