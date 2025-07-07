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
    <div className="space-y-6">
      {games.map((game) => {
        return (
          <div className="flex items-center justify-between bg-[#171717] rounded-lg p-4 border border-gray-800" key={game.id}>
            <div className="flex items-center">
              {game.gameType === "mcq" ? (
                <div className="bg-[#242424] p-3 rounded-lg">
                  <FaClipboardCheck className="text-[#ff7f01] text-lg" />
                </div>
              ) : (
                <div className="bg-[#242424] p-3 rounded-lg">
                  <FaPencilAlt className="text-[#ff7f01] text-lg" />
                </div>
              )}
              <div className="ml-4 space-y-2">
                <Link
                  className="text-lg font-medium leading-none hover:underline text-white"
                  href={`/statistics/${game.id}`}
                >
                  {game.topic}
                </Link>
                <p className="flex items-center px-3 py-1.5 text-sm text-white rounded-md w-fit bg-[#242424] border border-gray-700">
                  <FaClock className="w-4 h-4 mr-2 text-[#ff7f01]" />
                  {new Date(game.timeEnded ?? 0).toLocaleDateString()}
                </p>
                <p className="text-base text-gray-400">
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </p>
              </div>
            </div>
            <Link 
              href={`/statistics/${game.id}`}
              className="px-4 py-2 text-sm font-medium text-white bg-[#ff7f01] hover:bg-[#e67200] rounded transition-colors"
            >
              View Results
            </Link>
          </div>
        );
      })}
      
      {games.length === 0 && (
        <div className="text-center p-8 bg-[#171717] rounded-lg border border-gray-800">
          <p className="text-lg text-gray-400">No quiz history found</p>
        </div>
      )}
    </div>
  );
};

export default HistoryComp;