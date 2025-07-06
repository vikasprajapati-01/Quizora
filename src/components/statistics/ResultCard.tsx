import React from "react";
import { FaTrophy, FaMedal } from "react-icons/fa";

type Props = { accuracy: number };

const ResultCard = ({ accuracy }: Props) => {
  return (
    <div className="md:col-span-3 bg-[#171717] shadow-lg rounded-lg p-6 border border-gray-800">
      <div className="flex flex-row items-center justify-between pb-6">
        <h3 className="text-2xl font-bold text-white">Results</h3>
        <FaMedal className="text-[#ff7f01] w-7 h-7" />
      </div>
      <div className="flex flex-row items-center justify-center h-40 bg-[#0a0a0a] rounded-lg border border-gray-700 p-4">
        {accuracy > 75 ? (
          <div className="flex flex-row items-center">
            <FaTrophy className="mr-4 text-yellow-400 w-14 h-14" />
            <div className="flex flex-col">
              <span className="text-3xl font-semibold text-yellow-400">Impressive!</span>
              <span className="text-base text-gray-400">
                {"> 75% accuracy"}
              </span>
            </div>
          </div>
        ) : accuracy > 25 ? (
          <div className="flex flex-row items-center">
            <FaTrophy className="mr-4 text-gray-400 w-14 h-14" />
            <div className="flex flex-col">
              <span className="text-3xl font-semibold text-gray-400">Good job!</span>
              <span className="text-base text-gray-500">
                {"> 25% accuracy"}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center">
            <FaTrophy className="mr-4 text-amber-800 w-14 h-14" />
            <div className="flex flex-col">
              <span className="text-3xl font-semibold text-amber-800">Nice try!</span>
              <span className="text-base text-gray-500">
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