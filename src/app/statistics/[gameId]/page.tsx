import React from "react";

type Props = {
    params: {
        gameId: string;
    }
};

const Statistics = async ({params: { gameId }} : Props) => {
  return (
    <div>
        {gameId}
    </div>
  );
}

export default Statistics;