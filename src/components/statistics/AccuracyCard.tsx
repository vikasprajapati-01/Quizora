import React from "react";
import { FaBullseye } from "react-icons/fa";

type Props = { accuracy: number };

const AccuracyCard = ({ accuracy }: Props) => {
  accuracy = Math.round(accuracy * 100) / 100;
  
  return (
    <div className="md:col-span-3 bg-[#171717] shadow-lg rounded-lg border border-gray-800 overflow-hidden">
      <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-1 sm:pb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Average Accuracy</h3>
        <FaBullseye className="text-[#ff7f01] w-4 h-4 sm:w-5 sm:h-5" />
      </div>
      <div className="p-4 sm:p-6 pt-1 sm:pt-2">
        <div className="flex items-center">
          <span className="text-4xl sm:text-5xl font-bold text-[#ff7f01]">{accuracy}</span>
          <span className="text-xl sm:text-2xl text-white ml-1">%</span>
        </div>
        <div className="mt-3 sm:mt-4 bg-[#0a0a0a] rounded-full h-2 sm:h-2.5 w-full">
          <div 
            className="bg-[#ff7f01] h-2 sm:h-2.5 rounded-full" 
            style={{ width: `${accuracy}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AccuracyCard;