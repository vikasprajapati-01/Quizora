import React from "react";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/database";
import MCQ from "@/components/MCQ";

type Props = {
  params: Promise<{ gameId: string }>;
};

const MCQPage = async ({ params }: Props) => {
  const { gameId } = await params; // Await params

  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType !== "mcq") {
    return redirect("/quiz");
  }

  return <MCQ game={game} />;
};

export default MCQPage;