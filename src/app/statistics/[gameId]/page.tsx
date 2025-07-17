import React from "react";
import { prisma } from "@/lib/database";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FaThLarge } from "react-icons/fa";
import ResultCard from "@/components/statistics/ResultCard";
import AccuracyCard from "@/components/statistics/AccuracyCard";
import TimeCard from "@/components/statistics/TimeCard";
import QuestionsCard from "@/components/statistics/QuestionsCard";

type Props = {
  params: Promise<{ gameId: string }>;
};

const Statistics = async ({ params }: Props) => {
  const { gameId } = await params;

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  if (game.gameType === "mcq") {
    const totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);
    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === "open_ended") {
    const totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);
    accuracy = totalPercentage / game.questions.length;
  }
  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <div className="min-h-screen p-4 sm:p-8 mx-auto max-w-7xl bg-[#171717] text-white">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-white">Statistics</h2>
        <div className="flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-[#ff7f01] hover:bg-[#e67200] text-white font-medium transition-colors text-sm sm:text-base"
          >
            <FaThLarge className="mr-1.5 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <ResultCard accuracy={accuracy} />
        <AccuracyCard accuracy={accuracy} />
        <TimeCard
          timeEnded={new Date(game.timeEnded ?? 0)}
          timeStarted={new Date(game.timeStarted ?? 0)}
        />
      </div>
      
      <div className="mt-6 sm:mt-8 bg-[#0a0a0a] rounded-lg border border-gray-700 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-[#ff7f01]">Questions Summary</h3>
        <QuestionsCard questions={game.questions} />
      </div>
    </div>
  );
};

export default Statistics;