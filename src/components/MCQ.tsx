

"use client";
import React from "react";
import { Game, Question } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { FaChartBar, FaChevronRight, FaClock, FaCheckCircle, FaTimesCircle, FaSpinner, FaTrophy } from "react-icons/fa";
import { checkAnswerSchema, endGameSchema } from "@/schemas/form/quizVallidate";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

// Toast notification with auto-dismiss
function Toast({ open, setOpen, type, message, title }: { 
  open: boolean; 
  setOpen: (v: boolean) => void; 
  type: "success" | "error"; 
  message: string;
  title: string;
}) {
  React.useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [open, setOpen]);

  if (!open) return null;
  
  return (
    <div className={`mb-4 p-3 rounded-md ${
      type === 'error' 
        ? 'bg-red-900 border border-red-700 text-red-100' 
        : 'bg-green-900 border border-green-700 text-green-100'
    }`}>
      <div className="font-bold">{title}</div>
      <div>{message}</div>
    </div>
  );
}

// Loading overlay component
function LoadingOverlay() {
  return (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
      <div className="bg-[#171717] p-4 rounded-lg flex items-center space-x-3 border border-[#2a2a2a]">
        <FaSpinner className="w-5 h-5 text-[#ff7f01] animate-spin" />
        <span className="text-white font-medium">Checking answer...</span>
      </div>
    </div>
  );
}

// Format seconds to "Xm Ys"
function formatTimeDelta(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m > 0 ? `${m}m ` : ""}${s}s`;
}

type Props = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ: React.FC<Props> = ({ game }) => {
  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [hasEnded, setHasEnded] = React.useState(false);
  const [stats, setStats] = React.useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = React.useState<number>(0);
  const [now, setNow] = React.useState(new Date());
  const [toast, setToast] = React.useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const currentQuestion = React.useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = React.useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  // Using React Query mutations
  const { mutate: checkAnswer, isPending: isChecking } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      };
      const response = await axios.post(`/api/checkAnswer`, payload);
      return response.data;
    },
  });

  const { mutate: endGame } = useMutation({
    mutationFn: async () => {
      const payload: z.infer<typeof endGameSchema> = {
        gameId: game.id,
      };
      const response = await axios.post(`/api/endGame`, payload);
      return response.data;
    },
  });

  // Timer
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  // Handle next question logic
  const handleNext = React.useCallback(() => {
    checkAnswer(undefined, {
      onSuccess: ({ isCorrect }) => {
        if (isCorrect) {
          setStats((stats) => ({
            ...stats,
            correct_answers: stats.correct_answers + 1,
          }));
          setToast({
            show: true,
            title: "Correct",
            message: "You got it right!",
            type: "success",
          });
        } else {
          setStats((stats) => ({
            ...stats,
            wrong_answers: stats.wrong_answers + 1,
          }));
          setToast({
            show: true,
            title: "Incorrect",
            message: "You got it wrong!",
            type: "error",
          });
        }
        
        if (questionIndex === game.questions.length - 1) {
          endGame();
          setHasEnded(true);
          return;
        }
        setQuestionIndex((questionIndex) => questionIndex + 1);
        setSelectedChoice(0);
      },
    });
  }, [checkAnswer, questionIndex, game.questions.length, endGame]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isChecking) return;
      
      const key = event.key;

      if (key === "1" && options.length >= 1) {
        setSelectedChoice(0);
      } else if (key === "2" && options.length >= 2) {
        setSelectedChoice(1);
      } else if (key === "3" && options.length >= 3) {
        setSelectedChoice(2);
      } else if (key === "4" && options.length >= 4) {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext, options.length, isChecking]);

  // Calculate elapsed time (seconds)
  const elapsedSeconds = React.useMemo(() => {
    if (typeof game.timeStarted === "string") {
      return Math.floor((now.getTime() - new Date(game.timeStarted).getTime()) / 1000);
    }
    if (game.timeStarted instanceof Date) {
      return Math.floor((now.getTime() - game.timeStarted.getTime()) / 1000);
    }
    return 0;
  }, [now, game.timeStarted]);

  // If quiz has ended
  if (hasEnded) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#171717] shadow-lg rounded-lg p-8 w-full border border-gray-800">
            <div className="flex flex-col items-center">
              <FaTrophy className="text-[#ff7f01] w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Quiz Completed!</h2>
              <div className="px-4 py-2 mt-2 font-semibold text-white bg-[#ff7f01] rounded-md whitespace-nowrap mb-6">
                Time: {formatTimeDelta(elapsedSeconds)}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                <div className="text-2xl font-bold text-[#ff7f01]">{stats.correct_answers}</div>
                <div className="text-sm text-gray-300">Correct</div>
              </div>
              <div className="text-center bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                <div className="text-2xl font-bold text-red-500">{stats.wrong_answers}</div>
                <div className="text-sm text-gray-300">Wrong</div>
              </div>
              <div className="text-center bg-[#0a0a0a] p-3 rounded-lg border border-gray-800">
                <div className="text-2xl font-bold text-blue-400">{game.questions.length}</div>
                <div className="text-sm text-gray-300">Total</div>
              </div>
            </div>
            
            <Link
              href={`/statistics/${game.id}`}
              className="flex items-center justify-center px-6 py-3 bg-[#ff7f01] text-white font-semibold rounded-md hover:bg-[#e67200] w-full transition-colors"
            >
              View Statistics <FaChartBar className="w-5 h-5 ml-2" />
            </Link>

            <Link
              href={`/quiz`}
              className="flex items-center justify-center mt-2 px-6 py-3 bg-[#ff7f01] text-white font-semibold rounded-md hover:bg-[#e67200] w-full transition-colors"
            >
              Back to quiz
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-16 min-h-screen px-4 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {toast.show && (
          <Toast 
            open={toast.show} 
            setOpen={(v) => setToast(prev => ({ ...prev, show: v }))} 
            type={toast.type} 
            title={toast.title}
            message={toast.message} 
          />
        )}
        
        <div className="bg-[#171717] shadow-lg rounded-lg p-6 w-full border border-gray-800 relative">
          {/* Loading overlay - centered */}
          {isChecking && <LoadingOverlay />}
          
          {/* Header with topic and stats */}
          <div className="flex flex-row justify-between items-center mb-6">
            <div>
              <p className="mb-1">
                <span className="text-gray-300">Topic:</span> &nbsp;
                <span className="px-2 py-1 text-white rounded-lg bg-[#0a0a0a] border border-gray-700">
                  {game.topic}
                </span>
              </p>
              <div className="flex items-center text-gray-300">
                <FaClock className="mr-2 text-[#ff7f01]" />
                {formatTimeDelta(elapsedSeconds)}
              </div>
            </div>
            
            <div className="flex flex-col items-end text-sm">
              <div className="flex items-center">
                <span className="text-[#ff7f01] font-bold">{stats.correct_answers}</span>
                <span className="ml-1 text-gray-300">Correct</span>
              </div>
              <div className="flex items-center">
                <span className="text-red-500 font-bold">{stats.wrong_answers}</span>
                <span className="ml-1 text-gray-300">Wrong</span>
              </div>
            </div>
          </div>
          
          {/* Question card */}
          <div className="mb-6 bg-[#0a0a0a] rounded-lg border border-gray-700 p-4">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4 bg-[#171717] px-3 py-2 rounded-md border border-gray-700">
                <span className="text-xl font-bold text-[#ff7f01]">{questionIndex + 1}</span>
                <span className="text-xs text-gray-400">/ {game.questions.length}</span>
              </div>
              <div className="text-lg text-white">
                {currentQuestion?.question}
              </div>
            </div>
          </div>
          
          {/* Options */}
          <div className="space-y-4 mb-6">
            {options.map((option, index) => (
              <button
                key={option}
                className={`w-full text-left px-5 py-4 rounded-md border transition
                  ${selectedChoice === index ? 
                    "border-[#ff7f01] bg-[#ff7f01]/10 text-white" : 
                    "border-gray-700 bg-[#0a0a0a] text-gray-200 hover:border-[#ff7f01]/70"
                  }`}
                onClick={() => setSelectedChoice(index)}
                disabled={isChecking}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-md mr-3 
                    ${selectedChoice === index ? "bg-[#ff7f01] text-white" : "bg-[#171717] text-gray-300 border border-gray-700"}`}>
                    {index + 1}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>
          
          {/* Next button */}
          <button
            className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium
              bg-[#ff7f01] hover:bg-[#e67200] text-white transition-colors
              ${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isChecking}
            onClick={handleNext}
          >
            Next Question <FaChevronRight className="w-4 h-4 ml-2" />
          </button>
          
          {/* Keyboard hint */}
          <div className="mt-4 text-center text-sm text-gray-400">
            Use keyboard: 1-{options.length} to select, Enter to submit
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCQ;