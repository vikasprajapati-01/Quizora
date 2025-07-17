import React from "react";
import { FaHourglassHalf } from "react-icons/fa";
import { formatTimeDelta } from "@/lib/timeFormat";
import { differenceInSeconds } from "date-fns";

type Props = {
  timeEnded: Date;
  timeStarted: Date;
};

const TimeCard = ({ timeEnded, timeStarted }: Props) => {
  return (
    <div className="md:col-span-4 bg-[#171717] shadow-lg rounded-lg border border-gray-800 overflow-hidden">
      <div className="flex flex-row items-center justify-between p-4 sm:p-6 pb-1 sm:pb-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Time Taken</h3>
        <FaHourglassHalf className="text-[#ff7f01] w-5 h-5 sm:w-6 sm:h-6" />
      </div>
      <div className="p-4 sm:p-6 pt-1 sm:pt-2">
        <div className="flex items-center">
          <span className="text-4xl sm:text-5xl font-bold text-[#ff7f01]">
            {formatTimeDelta(differenceInSeconds(timeEnded, timeStarted))}
          </span>
        </div>
        <div className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-400">
          Started: {timeStarted.toLocaleTimeString()}
        </div>
        <div className="text-base sm:text-lg text-gray-400">
          Completed: {timeEnded.toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default TimeCard;