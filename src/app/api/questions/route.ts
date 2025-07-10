import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { quizCreationSchema } from "@/schemas/form/quizVallidate";
import { gemini_output } from "@/lib/gpt";
import { getAuthSession } from "@/lib/next-auth";

export const POST = async (req: Request) => {
    try {
        // const session = await getAuthSession();
        // if (!session?.user) {
        // return NextResponse.json(
        //         { error: "You must be logged in to create a game." },
        //         {
        //         status: 401,
        //         }
        //     );
        // }

        const body = await req.json();
        const {topic, amount, type} = quizCreationSchema.parse(body);

        let questions: any;

        if (type === "open_ended") {
            questions = await gemini_output(
                "Consider yourself as a teacher or an interviewer. Now generate a pair of questions and answers, the length of each answer should not be more than 20 words, store all the pairs of answers and questions in a JSON array",
                new Array(amount).fill(`You need to generate a random hard open-ended questions about ${topic} and total of ${amount} questions only`),
                {
                    question: "question",
                    answer: "answer with max length of 20 words",
                }
            );
        } 
        else if (type === "mcq") {
            questions = await gemini_output(
                "Consider yourself as a teacher or an interviewer. Now generate mcq questions and answers, the length of each answer should not be more than 15 words, store all answers and questions and options in a JSON array",
                new Array(amount).fill(
                `You need to generate random hard mcq question about ${topic} and total of ${amount} questions only`
                ),
                {
                    question: "question",
                    answer: "answer with max length of 15 words",
                    option1: "option1 with max length of 15 words",
                    option2: "option2 with max length of 15 words",
                    option3: "option3 with max length of 15 words",
                }
            );
        }

        return NextResponse.json(
            { questions: questions, }, { status: 200, }
        );
    }
    catch (error) {
        console.error("Error in POST /api/questions:", error);
        if(error instanceof ZodError) {
            return NextResponse.json( { error: error.issues } , { status: 400 });
        }
        // Add this to handle other errors
        return NextResponse.json( 
            { error: "An error occurred", details: (error as Error).message }, 
            { status: 500 } 
        );
    }
}