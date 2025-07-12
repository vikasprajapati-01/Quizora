import React from "react";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/next-auth";
import CreateQuiz from "./CreateQuiz";

export const metadata = {
    title: "Quiz - Quizora",
}

const QuizPage = async ({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) => {
    const session = await getAuthSession();
    if(!session?.user) {
        return redirect("/");
    }
    
    // Convert topic to string and pass it as topicParam prop to match CreateQuiz's expected props
    const topic = typeof searchParams.topic === 'string' ? searchParams.topic : '';
    
    return <CreateQuiz topicParam={topic} />;
}

export default QuizPage