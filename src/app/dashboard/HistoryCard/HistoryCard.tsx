"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { MdHistory, MdArrowForward } from "react-icons/md";

type Props = {};

const HistoryCard = (props: Props) => {
  const router = useRouter();
  
  return (
    <div 
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2F2B2B] hover:shadow-lg hover:shadow-[#ff7f01]/10 transition-all duration-300 hover:border-[#ff7f01]/50 hover:scale-[1.02] group overflow-hidden"
        // onClick={() => {
      //   router.push("/quiz");
      // }}
    >
      <div className="p-5 sm:p-6 md:p-7">
        <div className="flex flex-row items-center justify-between pb-3 sm:pb-4">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-800 dark:text-white group-hover:text-[#ff7f01] transition-colors duration-300">
            History
          </h3>
          <div className="p-2 sm:p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/20 group-hover:bg-[#ff7f01]/20 group-hover:scale-110 transition-all duration-300">
            <MdHistory size={24} className="text-[#ff7f01] transition-transform group-hover:rotate-12 duration-300" />
          </div>
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            View past quiz attempts and track your progress.
          </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-end">
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#ff7f01] rounded-md hover:bg-[#e67400] transition-all duration-200 group-hover:shadow-md transform group-hover:translate-x-1 cursor-pointer"
              onClick={() => {
                router.push("/history");
              }}
            >
              View History 
              <MdArrowForward className="text-white transition-transform group-hover:translate-x-1 duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;