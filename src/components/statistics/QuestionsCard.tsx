"use client";
import React from "react";
import { Question } from "@prisma/client";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Props = {
  questions: Question[];
};

const QuestionsCard = ({ questions }: Props) => {
  return (
    <div className="mt-2 sm:mt-4 bg-[#171717] shadow-lg rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-3 sm:p-4 md:p-6 pb-1 sm:pb-2 md:pb-3">
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">Questions</h3>
      </div>

      {/* Mobile view (stacked cards) for very small screens */}
      <div className="block sm:hidden px-2 pb-3">
        {questions.map(
          ({ answer, question, userAnswer, percentageCorrect, isCorrect, questionType }, index) => (
            <div key={index} className="mb-3 bg-[#0a0a0a] rounded-lg border border-gray-800 p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-white font-semibold bg-[#171717] px-1.5 py-0.5 rounded text-xs">Q{index + 1}</span>
                {questionType === "open_ended" && (
                  <div className="flex items-center">
                    <span className="text-[#ff7f01] font-medium text-xs">{percentageCorrect}%</span>
                  </div>
                )}
                {questionType === "mcq" && (
                  <div>
                    {isCorrect ? (
                      <FaCheckCircle className="text-green-500 w-4 h-4" />
                    ) : (
                      <FaTimesCircle className="text-red-500 w-4 h-4" />
                    )}
                  </div>
                )}
              </div>
              
              <div className="text-xs leading-tight text-white mb-1.5 break-words">{question}</div>
              
              <div className="mb-1.5">
                <span className="text-xs text-gray-400">Answer: </span>
                <span className="text-[#ff7f01] text-xs font-semibold break-words">{answer}</span>
              </div>
              
              <div>
                <span className="text-xs text-gray-400">Your answer: </span>
                <span className={`text-xs font-semibold break-words ${
                  questionType === "mcq" 
                    ? (isCorrect ? "text-green-500" : "text-red-500") 
                    : "text-white"
                }`}>
                  {userAnswer || "No answer provided"}
                </span>
              </div>
              
              {questionType === "open_ended" && (
                <div className="mt-1.5 w-full bg-gray-700 rounded-full h-1">
                  <div 
                    className="bg-[#ff7f01] h-1 rounded-full" 
                    style={{ width: `${percentageCorrect}%` }}
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* Table view for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-400 w-[40px] sm:w-[50px]">No.</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-400">Question & Correct Answer</th>
              <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-sm sm:text-base font-medium text-gray-400">Your Answer</th>
              {questions[0]?.questionType === "open_ended" && (
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-sm sm:text-base font-medium text-gray-400 w-[100px] sm:w-[120px]">Accuracy</th>
              )}
            </tr>
          </thead>
          <tbody>
            {questions.map(
              ({ answer, question, userAnswer, percentageCorrect, isCorrect, questionType }, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-[#1a1a1a]">
                  <td className="px-3 sm:px-6 py-4 sm:py-5 text-white font-medium align-top text-base sm:text-lg">{index + 1}</td>
                  <td className="px-3 sm:px-6 py-4 sm:py-5 text-white align-top">
                    <div className="text-base sm:text-lg">{question}</div>
                    <div className="mt-3 sm:mt-4">
                      <span className="text-sm sm:text-base text-gray-400">Answer: </span>
                      <span className="font-semibold text-[#ff7f01] text-base sm:text-lg">{answer}</span>
                    </div>
                  </td>
                  
                  {questionType === "open_ended" ? (
                    <td className="px-3 sm:px-6 py-4 sm:py-5 align-top">
                      <span className="text-sm sm:text-base text-gray-400">Your answer: </span>
                      <span className="text-white font-semibold text-base sm:text-lg">{userAnswer || "No answer provided"}</span>
                    </td>
                  ) : (
                    <td className="px-3 sm:px-6 py-4 sm:py-5 align-top">
                      <div className="flex items-start">
                        {isCorrect ? (
                          <FaCheckCircle className="text-green-500 mr-2 mt-1 sm:mt-1.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <FaTimesCircle className="text-red-500 mr-2 mt-1 sm:mt-1.5 flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                        <div>
                          <span className="text-sm sm:text-base text-gray-400">Your answer: </span>
                          <span className={isCorrect ? "text-green-500 font-semibold text-base sm:text-lg" : "text-red-500 font-semibold text-base sm:text-lg"}>
                            {userAnswer || "No answer provided"}
                          </span>
                        </div>
                      </div>
                    </td>
                  )}

                  {questionType === "open_ended" && (
                    <td className="px-3 sm:px-6 py-4 sm:py-5 text-right align-top">
                      <div className="flex flex-col items-end">
                        <span className="text-[#ff7f01] font-medium text-lg sm:text-xl">{percentageCorrect}%</span>
                        <div className="w-16 sm:w-20 bg-gray-700 rounded-full h-2 sm:h-2.5 mt-1.5 sm:mt-2">
                          <div 
                            className="bg-[#ff7f01] h-2 sm:h-2.5 rounded-full" 
                            style={{ width: `${percentageCorrect}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionsCard;