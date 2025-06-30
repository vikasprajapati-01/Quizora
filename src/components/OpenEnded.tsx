"use client";
import React from "react";
import { Game, Question } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { FaChevronRight, FaClock, FaSpinner, FaChartBar, FaTrophy } from "react-icons/fa";
import { checkAnswerSchema, endGameSchema } from "@/schemas/form/quizVallidate";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";

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
    <div className="fixed top-20 left-1/2 z-50 transform -translate-x-1/2 px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 bg-[#ff7f01] text-white">
      {message}
    </div>
  );
}

// Animated percentage bar for open ended
function OpenEndedPercentage({ percentage }: { percentage: number }) {
  const pct = Math.round(percentage);
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-[#ff7f01] font-bold">{isNaN(pct) ? 0 : pct}%</span>
        <span className="text-gray-300">Avg Similarity</span>
      </div>
      <div className="w-24 h-2 mt-1 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-2 bg-[#ff7f01] rounded-full transition-all"
          style={{ width: `${isNaN(pct) ? 0 : pct}%` }}
        ></div>
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
  const [userInput, setUserInput] = React.useState<string>("");
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
      const payload: z.infer<typeof checkAnswerSchema> = {
        questionId: currentQuestion.id,
        userInput: userInput.trim(),
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
    if (!userInput.trim()) {
      setToast({ open: true, message: "Please enter your answer!" });
      return;
    }
    checkAnswer(undefined, {
      onSuccess: ({ percentageSimilar }) => {
        setToast({
          open: true,
          message: `Your answer is ${percentageSimilar}% similar to the correct answer.`,
        });
        setAveragePercentage((prev) => (prev * questionIndex + percentageSimilar) / (questionIndex + 1));
        setUserInput("");
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
  }, [checkAnswer, questionIndex, game.questions.length, userInput, endGame]);

  // Use form submit for Enter key support and accessibility
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNext();
  };

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
              <OpenEndedPercentage percentage={averagePercentage} />
            </div>
            <Link
              href={`/statistics/${game.id}`}
              className="flex items-center justify-center mt-8 px-6 py-3 bg-[#ff7f01] text-white font-semibold rounded-md hover:bg-[#e67200] w-full transition-colors"
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <Toast open={toast.open} setOpen={(v) => setToast(prev => ({ ...prev, open: v }))} message={toast.message} />
      <div className="w-full max-w-2xl bg-[#171717] shadow-lg rounded-lg p-6 border border-gray-800 relative">
        {/* Loading overlay */}
        {isChecking && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-lg z-10 backdrop-blur-sm">
            <div className="bg-[#171717] p-4 rounded-lg flex items-center space-x-3 border border-[#2a2a2a]">
              <FaSpinner className="w-5 h-5 text-[#ff7f01] animate-spin" />
              <span className="text-white font-medium">Checking answer...</span>
            </div>
          </div>
        )}

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
          <OpenEndedPercentage percentage={averagePercentage} />
        </div>

        <div className="mb-6 bg-[#0a0a0a] rounded-lg border border-gray-700 p-4">
          <div className="flex items-start">
            <div className="flex flex-col items-center mr-4 bg-[#171717] px-3 py-2 rounded-md border border-gray-700">
              <span className="text-xl font-bold text-[#ff7f01]">{questionIndex + 1}</span>
              <span className="text-xs text-gray-400">/ {game.questions.length}</span>
            </div>
            <div className="text-lg text-white">
              {/* Show the full question, not just the blank */}
              {currentQuestion?.question}
            </div>
          </div>
        </div>

        <form
          className="flex flex-col items-center gap-4"
          onSubmit={handleFormSubmit}
        >
          <input
            type="text"
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            className="w-full px-4 py-3 rounded-md bg-[#0a0a0a] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#ff7f01] text-lg"
            placeholder="Type your answer here"
            disabled={isChecking}
            autoFocus
          />
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md flex items-center justify-center font-medium
              bg-[#ff7f01] hover:bg-[#e67200] text-white transition-colors
              ${isChecking ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isChecking}
          >
            Next <FaChevronRight className="w-4 h-4 ml-2" />
          </button>
          <div className="mt-2 text-sm text-gray-400 text-center">
            Press Enter to submit your answer
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpenEnded;