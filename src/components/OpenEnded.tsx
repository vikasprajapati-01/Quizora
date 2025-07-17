"use client";
import React from "react";
import { Game, Question } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { FaChevronRight, FaClock, FaSpinner, FaChartBar, FaTrophy, FaPercent, FaThLarge } from "react-icons/fa";
import { checkAnswerSchema, endGameSchema } from "@/schemas/form/quizVallidate";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import keywordExtractor from "keyword-extractor";

// Helper to format time
function formatTimeDelta(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m > 0 ? `${m}m ` : ""}${s}s`;
}

// Simple toast notification
function Toast({ open, setOpen, message }: { open: boolean; setOpen: (v: boolean) => void; message: string }) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [open, setOpen]);
  if (!open) return null;
  return (
    <div className="fixed top-16 sm:top-20 left-1/2 z-50 transform -translate-x-1/2 px-4 sm:px-5 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 bg-[#ff7f01] text-white text-sm sm:text-base max-w-[90%] sm:max-w-none text-center">
      {message}
    </div>
  );
}

// Enhanced percentage component with card styling
function OpenEndedPercentage({ percentage }: { percentage: number }) {
  const pct = Math.round(percentage);
  return (
    <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3">
      <FaThLarge className="text-[#ff7f01] w-5 h-5 sm:w-6 sm:h-6" />
      <div className="flex items-center">
        <span className="text-xl sm:text-2xl font-bold text-white">{isNaN(pct) ? 0 : pct}</span>
        <FaPercent className="text-gray-400 w-3 h-3 sm:w-4 sm:h-4 ml-1" />
      </div>
    </div>
  );
}

// Blank Answer Input Component - FIXED
function BlankAnswerInput({ 
  answer, 
  setBlankAnswer 
}: { 
  answer: string; 
  setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
}) {
  const blank = "_____";
  
  const keywords = React.useMemo(() => {
    const words = keywordExtractor.extract(answer, {
      language: "english",
      remove_digits: true,
      return_changed_case: false,
      remove_duplicates: false,
    });
    // mix the keywords and pick 2
    const shuffled = words.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }, [answer]);

  const answerWithBlanks = React.useMemo(() => {
    const answerWithBlanks = keywords.reduce((acc, curr) => {
      return acc.replaceAll(curr, blank);
    }, answer);
    return answerWithBlanks;
  }, [answer, keywords]);

  React.useEffect(() => {
    setBlankAnswer(answerWithBlanks);
  }, [answerWithBlanks, setBlankAnswer]);

  return (
    <div className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
      <h3 className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3">Fill in the blanks:</h3>
      <div className="text-base sm:text-lg text-white leading-relaxed">
        {answerWithBlanks.split(blank).map((part, index) => {
          return (
            <React.Fragment key={index}>
              {part}
              {index === answerWithBlanks.split(blank).length - 1 ? (
                ""
              ) : (
                <input
                  id="user-blank-input"
                  className="mx-1 sm:mx-2 px-1 sm:px-2 py-0.5 sm:py-1 text-center border-b-2 border-[#ff7f01] bg-transparent text-white w-16 sm:w-24 focus:border-b-4 focus:outline-none focus:bg-[#ff7f01]/10 transition-all text-sm sm:text-base"
                  type="text"
                  placeholder="___"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded: React.FC<Props> = ({ game }) => {
  const [hasEnded, setHasEnded] = React.useState(false);
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [blankAnswer, setBlankAnswer] = React.useState<string>("");
  const [averagePercentage, setAveragePercentage] = React.useState(0);
  const [now, setNow] = React.useState(new Date());
  const [toast, setToast] = React.useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const currentQuestion = React.useMemo(() => game.questions[questionIndex], [questionIndex, game.questions]);

  // Timer
  React.useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  // Answer check mutation
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      let filledAnswer = blankAnswer;
      // Fill in the blanks from user inputs
      document.querySelectorAll("#user-blank-input").forEach((input) => {
        const inputElement = input as HTMLInputElement;
        filledAnswer = filledAnswer.replace("_____", inputElement.value);
        inputElement.value = "";
      });
      
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  // End game mutation
  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  // Calculate elapsed time
  const elapsedSeconds = React.useMemo(() => {
    if (typeof game.timeStarted === "string") {
      return Math.floor((now.getTime() - new Date(game.timeStarted).getTime()) / 1000);
    }
    if (game.timeStarted instanceof Date) {
      return Math.floor((now.getTime() - game.timeStarted.getTime()) / 1000);
    }
    return 0;
  }, [now, game.timeStarted]);

  const handleNext = React.useCallback(() => {
    // Check if all blanks are filled
    const blankInputs = document.querySelectorAll("#user-blank-input") as NodeListOf<HTMLInputElement>;
    const allFilled = Array.from(blankInputs).every(input => input.value.trim() !== "");
    
    if (!allFilled) {
      setToast({ open: true, message: "Please fill in all the blanks!" });
      return;
    }

    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        setToast({
          open: true,
          message: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
        });
        setAveragePercentage((prev) => (prev * questionIndex + percentageSimilar) / (questionIndex + 1));
        
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((prev) => prev + 1);
      },
      onError: () => {
        setToast({ open: true, message: "Something went wrong!" });
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, endGame]);

  // Use form submit for Enter key support and accessibility
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

  if (hasEnded) {
    return (
      <div className="pt-8 sm:pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#171717] shadow-lg rounded-lg p-6 sm:p-8 w-full border border-gray-800">
            <div className="flex flex-col items-center">
              <FaTrophy className="text-[#ff7f01] w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
              <div className="px-3 sm:px-4 py-1.5 sm:py-2 mt-2 font-semibold text-white bg-[#ff7f01] rounded-md whitespace-nowrap mb-4 sm:mb-6 text-sm sm:text-base">
                Time: {formatTimeDelta(elapsedSeconds)}
              </div>
              <div className="mb-4 sm:mb-6">
                <OpenEndedPercentage percentage={averagePercentage} />
              </div>
            </div>
            <Link
              href={`/statistics/${game.id}`}
              className="flex items-center justify-center mt-6 sm:mt-8 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#ff7f01] text-white font-semibold rounded-md hover:bg-[#e67200] w-full transition-colors text-sm sm:text-base"
            >
              View Statistics <FaChartBar className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Link>
            <Link
              href={`/quiz`}
              className="flex items-center justify-center mt-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#ff7f01] text-white font-semibold rounded-md hover:bg-[#e67200] w-full transition-colors text-sm sm:text-base"
            >
              Back to quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12">
      <Toast open={toast.open} setOpen={(v) => setToast(prev => ({ ...prev, open: v }))} message={toast.message} />
      <div className="w-full max-w-4xl bg-[#171717] shadow-lg rounded-lg p-4 sm:p-6 border border-gray-800 relative">
        {/* Loading overlay */}
        {isChecking && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
            <div className="bg-[#171717] p-3 sm:p-4 rounded-lg flex items-center space-x-2 sm:space-x-3 border border-[#2a2a2a]">
              <FaSpinner className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff7f01] animate-spin" />
              <span className="text-white font-medium text-sm sm:text-base">Checking answer...</span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div>
            <p className="mb-1">
              <span className="text-gray-300 text-sm sm:text-base">Topic:</span> &nbsp;
              <span className="px-2 py-1 text-sm sm:text-base text-white rounded-lg bg-[#0a0a0a] border border-gray-700">
                {game.topic}
              </span>
            </p>
            <div className="flex items-center text-gray-300 text-sm sm:text-base">
              <FaClock className="mr-2 text-[#ff7f01]" />
              {formatTimeDelta(elapsedSeconds)}
            </div>
          </div>
          <OpenEndedPercentage percentage={averagePercentage} />
        </div>

        <div className="mb-4 sm:mb-6 bg-[#0a0a0a] rounded-lg border border-gray-700 p-3 sm:p-4">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-3 sm:mr-4 bg-[#171717] px-2 sm:px-3 py-1.5 sm:py-2 rounded-md border border-gray-700">
              <span className="text-base sm:text-xl font-bold text-[#ff7f01]">{questionIndex + 1}</span>
              <span className="text-[10px] sm:text-xs text-gray-400">/ {game.questions.length}</span>
            </div>
            <div className="text-base sm:text-lg text-white">
              {currentQuestion?.question}
            </div>
          </div>
        </div>

        <form
          className="flex flex-col items-center gap-3 sm:gap-4"
          onSubmit={handleFormSubmit}
        >
          {/* Blank Answer Input */}
          {currentQuestion?.answer && (
            <BlankAnswerInput
              answer={currentQuestion.answer}
              setBlankAnswer={setBlankAnswer}
            />
          )}
          
          <button
            type="submit"
            className={`w-full py-2.5 sm:py-3 px-4 rounded-md flex items-center justify-center font-medium text-sm sm:text-base
              bg-[#ff7f01] hover:bg-[#e67200] text-white transition-colors
              ${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isChecking}
          >
            Next <FaChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
          </button>
          <div className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-400 text-center">
            Fill in all blanks and press Enter to submit
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpenEnded;