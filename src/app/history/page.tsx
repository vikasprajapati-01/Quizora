import HistoryComp from "@/components/History/HistoryComp";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Link from "next/link";
import { FaThLarge } from "react-icons/fa";

// type Props = {};

const History = async () => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  return (
    <div className="min-h-screen p-4 sm:p-8 bg-[#0a0a0a]">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Quiz History</h1>
          <Link 
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 rounded bg-[#ff7f01] hover:bg-[#e67200] text-white font-medium transition-colors text-base sm:text-lg"
          >
            <FaThLarge className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
            Back to Dashboard
          </Link>
        </div>
        
        <div className="bg-[#171717] rounded-lg border border-gray-800 p-4 sm:p-6">
          <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto pr-1 sm:pr-2">
            <HistoryComp limit={100} userId={session.user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;