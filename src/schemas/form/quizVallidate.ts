import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(3, {
      message: "Topic must be at least 3 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    }),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(25),
});

export const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
});