import React from "react";
import Link from "next/link";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import HistoryComp from "@/components/History/HistoryComp";
import { prisma } from "@/lib/database";
import { FaHistory, FaArrowRight } from "react-icons/fa";

type Props = object;

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
      <div className="p-6 pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold text-white flex items-center">
            Recent Activity
            <FaHistory className="ml-2 text-[#ff7f01]" />
          </h3>
        </div>
        <p className="text-gray-400 mt-2 text-base">
          You have played a total of <span className="font-semibold text-[#ff7f01]">{games_count}</span> quizzes.
        </p>
      </div>
      
      <div className="px-6 pb-3">
        <div className="max-h-[480px] overflow-y-auto pr-2">
          <HistoryComp limit={10} userId={session.user.id} />
        </div>
      </div>
      
      <div className="px-6 pb-6 pt-3 flex justify-center">
        <Link 
          href="/history" 
          className="flex items-center justify-center w-full py-3 text-white bg-[#242424] hover:bg-[#2f2f2f] rounded-md transition-colors text-lg font-medium border border-gray-700"
        >
          Show More
          <FaArrowRight className="ml-2 text-[#ff7f01]" />
        </Link>
      </div>
    </div>
  );
};

export default RecentActivityCard;