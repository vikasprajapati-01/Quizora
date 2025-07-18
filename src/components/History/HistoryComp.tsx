import { prisma } from "@/lib/database";
import { FaClock, FaClipboardCheck, FaPencilAlt } from "react-icons/fa";
import Link from "next/link";
import React from "react";

type Props = {
  limit: number;
  userId: string;
};

const HistoryComp = async ({ limit, userId }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });
  
  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {games.map((game) => {
        return (
          <div 
            className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#171717] rounded-lg p-2.5 sm:p-3 lg:p-4 border border-gray-800" 
            key={game.id}
          >
            <div className="flex items-start sm:items-center">
              {game.gameType === "mcq" ? (
                <div className="bg-[#242424] p-1.5 sm:p-2 lg:p-3 rounded-lg">
                  <FaClipboardCheck className="text-[#ff7f01] text-sm sm:text-base lg:text-lg" />
                </div>
              ) : (
                <div className="bg-[#242424] p-1.5 sm:p-2 lg:p-3 rounded-lg">
                  <FaPencilAlt className="text-[#ff7f01] text-sm sm:text-base lg:text-lg" />
                </div>
              )}
              <div className="ml-2.5 sm:ml-3 lg:ml-4 space-y-0.5 sm:space-y-1 lg:space-y-2">
                <Link
                  className="text-sm sm:text-base lg:text-lg font-medium leading-tight hover:underline text-white block"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 lg:py-1.5 text-xs sm:text-sm text-white rounded-md bg-[#242424] border border-gray-700 mr-2">
                    <FaClock className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 mr-1 sm:mr-1.5 lg:mr-2 text-[#ff7f01]" />
                    {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-400">
                    {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                  </span>
                </div>
              </div>
            </div>
            <Link 
              href={`/statistics/${game.id}`}
              className="mt-2.5 sm:mt-0 px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 text-xs sm:text-sm font-medium text-white bg-[#ff7f01] hover:bg-[#e67200] rounded transition-colors self-end sm:self-auto whitespace-nowrap"
            >
              View Results
            </Link>
          </div>
        );
      })}
      
      {games.length === 0 && (
        <div className="text-center p-3 sm:p-4 lg:p-8 bg-[#171717] rounded-lg border border-gray-800">
          <p className="text-sm sm:text-base lg:text-lg text-gray-400">No quiz history found</p>
        </div>
      )}
    </div>
  );
};

export default HistoryComp;