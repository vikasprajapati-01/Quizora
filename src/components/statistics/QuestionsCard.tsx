"use client";
import React from "react";
import { Question } from "@prisma/client";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

type Props = {
  questions: Question[];
};

const QuestionsCard = ({ questions }: Props) => {
  return (
    <div className="mt-6 bg-[#171717] shadow-lg rounded-lg border border-gray-800 overflow-hidden">
      <div className="p-6 pb-3">
        <h3 className="text-2xl font-bold text-white">Questions</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="px-6 py-4 text-left text-base font-medium text-gray-400 w-[50px]">No.</th>
              <th className="px-6 py-4 text-left text-base font-medium text-gray-400">Question & Correct Answer</th>
              <th className="px-6 py-4 text-left text-base font-medium text-gray-400">Your Answer</th>
              {questions[0]?.questionType === "open_ended" && (
                <th className="px-6 py-4 text-right text-base font-medium text-gray-400 w-[120px]">Accuracy</th>
              )}
            </tr>
          </thead>
          <tbody>
            {questions.map(
              ({ answer, question, userAnswer, percentageCorrect, isCorrect, questionType }, index) => (
                <tr key={index} className="border-b border-gray-800 hover:bg-[#1a1a1a]">
                  <td className="px-6 py-5 text-white font-medium align-top text-lg">{index + 1}</td>
                  <td className="px-6 py-5 text-white align-top">
                    <div className="text-lg">{question}</div>
                    <div className="mt-4">
                      <span className="text-base text-gray-400">Answer: </span>
                      <span className="font-semibold text-[#ff7f01] text-lg">{answer}</span>
                    </div>
                  </td>
                  
                  {questionType === "open_ended" ? (
                    <td className="px-6 py-5 align-top">
                      <span className="text-base text-gray-400">Your answer: </span>
                      <span className="text-white font-semibold text-lg">{userAnswer || "No answer provided"}</span>
                    </td>
                  ) : (
                    <td className="px-6 py-5 align-top">
                      <div className="flex items-start">
                        {isCorrect ? (
                          <FaCheckCircle className="text-green-500 mr-2 mt-1.5 flex-shrink-0 w-5 h-5" />
                        ) : (
                          <FaTimesCircle className="text-red-500 mr-2 mt-1.5 flex-shrink-0 w-5 h-5" />
                        )}
                        <div>
                          <span className="text-base text-gray-400">Your answer: </span>
                          <span className={isCorrect ? "text-green-500 font-semibold text-lg" : "text-red-500 font-semibold text-lg"}>
                            {userAnswer || "No answer provided"}
                          </span>
                        </div>
                      </div>
                    </td>
                  )}

                  {questionType === "open_ended" && (
                    <td className="px-6 py-5 text-right align-top">
                      <div className="flex flex-col items-end">
                        <span className="text-[#ff7f01] font-medium text-xl">{percentageCorrect}%</span>
                        <div className="w-20 bg-gray-700 rounded-full h-2.5 mt-2">
                          <div 
                            className="bg-[#ff7f01] h-2.5 rounded-full" 
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
          <tfoot>
            <tr>
              <td colSpan={questions[0]?.questionType === "open_ended" ? 4 : 3} className="px-6 py-4 text-center text-base text-gray-400">
                End of list
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default QuestionsCard;