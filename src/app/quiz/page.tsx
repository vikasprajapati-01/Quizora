import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/next-auth";
import CreateQuiz from "./CreateQuiz";

export const metadata = {
    title: "Quiz - Quizora",
}

type Props = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const QuizPage = async ({ searchParams }: Props) => {
    const params = await searchParams;
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }

    // Convert topic to string and pass it as topicParam prop to match CreateQuiz's expected props
    const topic = typeof params.topic === "string" ? params.topic : "";

    return <CreateQuiz topicParam={topic} />;
};

export default QuizPage;