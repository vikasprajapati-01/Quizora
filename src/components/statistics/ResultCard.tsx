import React from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

type Props = { accuracy: number };

const ResultCard = ({ accuracy }: Props) => {
  return (
    <div className="md:col-span-3 bg-[#171717] shadow-lg rounded-lg p-4 sm:p-6 border border-gray-800">
      <div className="flex flex-row items-center justify-between pb-4 sm:pb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white">Results</h3>
        <FaMedal className="text-[#ff7f01] w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div className="flex flex-row items-center justify-center h-auto sm:h-40 py-6 sm:py-4 bg-[#0a0a0a] rounded-lg border border-gray-700 p-4">
        {accuracy > 75 ? (
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <FaTrophy className="mb-3 sm:mb-0 sm:mr-4 text-yellow-400 w-12 h-12 sm:w-14 sm:h-14" />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold text-yellow-400">Impressive!</span>
              <span className="text-sm sm:text-base text-gray-400">
                {"> 75% accuracy"}
              </span>
            </div>
          </div>
        ) : accuracy > 25 ? (
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <FaTrophy className="mb-3 sm:mb-0 sm:mr-4 text-gray-400 w-12 h-12 sm:w-14 sm:h-14" />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold text-gray-400">Good job!</span>
              <span className="text-sm sm:text-base text-gray-500">
                {"> 25% accuracy"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
            <FaTrophy className="mb-3 sm:mb-0 sm:mr-4 text-amber-800 w-12 h-12 sm:w-14 sm:h-14" />
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-semibold text-amber-800">Nice try!</span>
              <span className="text-sm sm:text-base text-gray-500">
                {"< 25% accuracy"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;