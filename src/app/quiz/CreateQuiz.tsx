"use client";

import { FaRegCircle, FaCircle } from "react-icons/fa";

import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaBook, FaCheckSquare } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { quizCreationSchema } from "@/schemas/form/quizVallidate";

type Input = z.infer<typeof quizCreationSchema>;

type Props = {
  topicParam: string;
};

const CreateQuiz = ({ topicParam }: Props) => {
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    title: string;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  const { mutate: getQuestions, isPending } = useMutation<
    { gameId: string }, 
    Error,
    Input
  >({
    mutationFn: async ({ amount, topic, type }: Input) => {
      // Changed this endpoint to match the original component
      const response = await axios.post("/api/game", { amount, topic, type, difficulty });  
      return response.data;
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam || "",
      type: "mcq",
      amount: 3,
      difficulty: "medium",
    },
  });

  const quizType = watch("type");
  const difficulty = watch("difficulty");

  const onSubmit = async (data: Input) => {
    setShowLoader(true);
    getQuestions(data, {
      onError: (error) => {
        setShowLoader(false);
        if (error instanceof AxiosError) {
          if (error.response?.status === 500) {
            setToast({
              show: true,
              title: "Error",
              message: "Something went wrong. Please try again later.",
              type: "error",
            });
            
            // Hide toast after 3 seconds
            setTimeout(() => {
              setToast(prev => ({ ...prev, show: false }));
            }, 3000);
          }
        }
      },
      onSuccess: (responseData) => {
        // console.log("API Response:", responseData); // Add this to debug
        
        // Extract gameId safely
        const gameId = responseData?.gameId;
        
        if (!gameId) {
          // console.error("Game ID not found in response:", responseData);
          setShowLoader(false);
          setToast({
            show: true,
            title: "Error",
            message: "Game ID not found in response. Please try again.",
            type: "error",
          });
          return;
        }
        
        setFinishedLoading(true);
        setTimeout(() => {
          if (data.type === "mcq") {
            router.push(`/play/mcq/${gameId}`);
          } else if (data.type === "open_ended") {
            router.push(`/play/open-ended/${gameId}`);
          }
        }, 2000);
      },
    });
  };

  // Rest of your component is unchanged
  // ...

  // Loading component
  if (showLoader) {
    return (
      <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex flex-col items-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-20 h-20 border-t-4 border-[#ff7f01] border-solid rounded-full animate-spin"></div>
          <h1 className="text-2xl font-bold text-white">
            {finishedLoading ? "Redirecting..." : "Creating your quiz..."}
          </h1>
          <p className="text-gray-300">
            {finishedLoading 
              ? "Your quiz has been created!" 
              : "Please wait while we generate your questions..."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full px-4 sm:px-0 max-w-[90%] sm:max-w-md mt-4 sm:mt-8">
      <div className="bg-[#171717] shadow-lg rounded-lg p-4 sm:p-6 w-full border border-gray-800">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Quiz Creation</h2>
          <p className="text-gray-300">Choose a topic</p>
        </div>
        
        {/* Toast notification */}
        {toast.show && (
          <div className={`mb-4 p-2 sm:p-3 rounded-md ${
            toast.type === 'error' 
              ? 'bg-red-900 border border-red-700 text-red-100' 
              : 'bg-green-900 border border-green-700 text-green-100'
          }`}>
            <div className="font-bold">{toast.title}</div>
            <div className="text-sm sm:text-base">{toast.message}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Topic field */}
          <div>
            <label htmlFor="topic" className="block text-sm font-medium text-gray-200 mb-1">
              Topic
            </label>
            <input
              id="topic"
              type="text"
              placeholder="Enter a topic"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7f01] text-white text-sm sm:text-base"
              {...register("topic")}
            />
            {errors.topic && (
              <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.topic.message}</p>
            )}
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Please provide any topic you would like to be quizzed on here.
            </p>
          </div>

          {/* Amount field */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-1">
              Number of Questions
            </label>
            <input
              id="amount"
              type="number"
              placeholder="How many questions?"
              className="w-full px-3 py-2 bg-[#0a0a0a] border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-[#ff7f01] text-white text-sm sm:text-base"
              {...register("amount", { 
                valueAsNumber: true,
                min: 1,
                max: 10 
              })}
              min={1}
              max={10}
            />
            {errors.amount && (
              <p className="mt-1 text-xs sm:text-sm text-red-400">{errors.amount.message}</p>
            )}
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              You can choose how many questions you would like to be quizzed on here.
            </p>
          </div>

          {/* Difficulty selection */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-1 sm:gap-2">
              <button
                type="button"
                className={`flex items-center justify-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-md ${
                  difficulty === "easy" 
                    ? "bg-green-700 text-white" 
                    : "bg-gray-800 text-gray-300"
                } transition-colors`}
                onClick={() => setValue("difficulty", "easy")}
              >
                {difficulty === "easy" 
                  ? <FaCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                  : <FaRegCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                }
                <span className="text-xs sm:text-sm">Easy</span>
              </button>
              
              <button
                type="button"
                className={`flex items-center justify-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-md ${
                  difficulty === "medium" 
                    ? "bg-[#ff7f01] text-white" 
                    : "bg-gray-800 text-gray-300"
                } transition-colors`}
                onClick={() => setValue("difficulty", "medium")}
              >
                {difficulty === "medium" 
                  ? <FaCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                  : <FaRegCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                }
                <span className="text-xs sm:text-sm">Medium</span>
              </button>
              
              <button
                type="button"
                className={`flex items-center justify-center py-1.5 sm:py-2 px-1 sm:px-3 rounded-md ${
                  difficulty === "hard" 
                    ? "bg-red-700 text-white" 
                    : "bg-gray-800 text-gray-300"
                } transition-colors`}
                onClick={() => setValue("difficulty", "hard")}
              >
                {difficulty === "hard" 
                  ? <FaCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> 
                  : <FaRegCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                }
                <span className="text-xs sm:text-sm">Hard</span>
              </button>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-gray-400">
              Select the difficulty level for your quiz.
            </p>
          </div>

          {/* Quiz type selection */}
          <div className="flex">
            <button
              type="button"
              className={`flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-4 w-1/2 ${
                quizType === "mcq" 
                  ? "bg-[#ff7f01] text-white" 
                  : "bg-gray-800 text-gray-300"
              } rounded-l-lg transition-colors text-xs sm:text-sm`}
              onClick={() => setValue("type", "mcq")}
            >
              <FaCheckSquare className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>Multiple Choice</span>
            </button>
            
            <button
              type="button"
              className={`flex items-center justify-center py-1.5 sm:py-2 px-2 sm:px-4 w-1/2 ${
                quizType === "open_ended" 
                  ? "bg-[#ff7f01] text-white" 
                  : "bg-gray-800 text-gray-300"
              } rounded-r-lg transition-colors text-xs sm:text-sm`}
              onClick={() => setValue("type", "open_ended")}
            >
              <FaBook className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span>Open Ended</span>
            </button>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full py-1.5 sm:py-2 px-4 bg-[#ff7f01] text-white rounded-md hover:bg-[#e67200] transition-colors ${
              isPending ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isPending ? "Creating..." : "Create Quiz"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;