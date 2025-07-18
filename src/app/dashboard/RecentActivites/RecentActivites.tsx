import React from "react";
import Link from "next/link";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import HistoryComp from "@/components/History/HistoryComp";
import { prisma } from "@/lib/database";
import { FaHistory, FaArrowRight } from "react-icons/fa";

const RecentActivityCard = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  
  const games_count = await prisma.game.count({
    where: {
      userId: session.user.id,
    },
  });
  
  return (
    <div className="col-span-4 lg:col-span-3 bg-[#2F2B2B] shadow-lg rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-4 sm:p-5 lg:p-6 pb-2 sm:pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center">
            Recent Activity
            <FaHistory className="ml-2 text-[#ff7f01] w-4 h-4 sm:w-5 sm:h-5" />
          </h3>
        </div>
        <p className="text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
          You have played a total of <span className="font-semibold text-[#ff7f01]">{games_count}</span> quizzes.
        </p>
      </div>
      
      <div className="px-3 sm:px-4 lg:px-6 pb-2 sm:pb-3">
        <div className="max-h-[250px] sm:max-h-[350px] lg:max-h-[480px] overflow-y-auto pr-1 sm:pr-2">
          <HistoryComp limit={10} userId={session.user.id} />
        </div>
      </div>

      <div className="px-3 sm:px-4 lg:px-6 pb-3 sm:pb-4 lg:pb-6 pt-1 sm:pt-2 lg:pt-3 flex justify-center">
        <Link 
          href="/history" 
          className="flex items-center justify-center w-full py-2 sm:py-2.5 lg:py-3 text-white bg-[#242424] hover:bg-[#2f2f2f] rounded-md transition-colors text-sm sm:text-base lg:text-lg font-medium border border-gray-700"
        >
          Show More
          <FaArrowRight className="ml-1.5 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4 text-[#ff7f01]" />
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityCard;