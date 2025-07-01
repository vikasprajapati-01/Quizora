
import { prisma } from "@/lib/database";
import { getAuthSession } from "@/lib/next-auth";
import { redirect } from "next/navigation";
import React from "react";

import OpenEnded from "@/components/OpenEnded";

type Props = {
  params: Promise<{
    gameId: string;
  }>;
};

const OpenEndedPage = async ({ params }: Props) => {
  // Await the params before using them
  const { gameId } = await params;
  
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
          answer: true,
        },
      },
    },
  });
  
  if (!game || game.gameType !== 'open_ended') {
    return redirect("/quiz");
  }
  
  return <OpenEnded game={game} />;
};

export default OpenEndedPage;