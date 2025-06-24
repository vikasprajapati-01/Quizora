import React from "react";

import { Game, Question } from "@prisma/client";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = async ({ game }: Props) => {
  return (
    <div>
      Hey
    </div>
  );
}

export default OpenEnded;