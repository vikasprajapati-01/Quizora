import React from "react";

import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/next-auth";
import CreateQuiz from "./CreateQuiz";

export const metadata = {
    title: "Quiz - Quizora",
}

const QuizPage = async () => {

    const session = await getAuthSession();
    if(!session?.user) {
        return redirect("/");
    }

    return(
        <CreateQuiz />
    )
}

export default QuizPage