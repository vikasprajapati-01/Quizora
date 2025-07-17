"use client";

import { useRouter } from "next/navigation";
import { BiBrain } from "react-icons/bi";
import { MdArrowForward } from "react-icons/md";

const QuizCard = () => {
  const router = useRouter();

  return (
    <div 
      className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#2F2B2B] hover:shadow-lg hover:shadow-[#ff7f01]/10 transition-all duration-300 hover:border-[#ff7f01]/50 hover:scale-[1.02] group overflow-hidden"
      // onClick={() => {
      //   router.push("/quiz");
      // }}
    >
      <div className="p-4 sm:p-5 md:p-7">
        <div className="flex flex-row items-center justify-between pb-2 sm:pb-3">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-gray-800 dark:text-white group-hover:text-[#ff7f01] transition-colors duration-300">
            Quiz me!
          </h3>
          <div className="p-1.5 sm:p-2 sm:p-2.5 rounded-full bg-orange-50 dark:bg-orange-900/20 group-hover:bg-[#ff7f01]/20 group-hover:scale-110 transition-all duration-300">
            <BiBrain size={20} className="text-[#ff7f01] transition-transform group-hover:rotate-12 duration-300" />
          </div>
        </div>
        <div className="pt-1">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            Challenge yourself to a quiz with a topic of your choice.
          </p>
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-end">
            <button 
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-[#ff7f01] rounded-md hover:bg-[#e67400] transition-all duration-200 group-hover:shadow-md transform group-hover:translate-x-1 cursor-pointer"
              onClick={() => {
                router.push("/quiz");
              }}
            >
              Start Quiz 
              <MdArrowForward className="text-white transition-transform group-hover:translate-x-1 duration-300" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;