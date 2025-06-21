// import { prisma } from '@/lib/database';
// 'use client';

import { redirect } from "next/navigation";

import Login from "@/components/Login";
import { MdOutlineQuiz } from "react-icons/md";
import { getAuthSession } from "@/lib/next-auth";

export default async function Home() {

  const session = await getAuthSession();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center p-4 bg-[var(--background)] transition-colors duration-300">
      <div
        className="w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8"
        style={{
          background: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div className="mb-6 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight" style={{ color: "var(--foreground)" }}>
                Welcome to <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent font-black">Quizora</span>
              </h2>
              <span className="text-orange-500 text-3xl md:text-4xl animate-pulse">
                <MdOutlineQuiz />
              </span>
            </div>
            <div className="h-1 w-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full my-2"></div>
          </div>
          
          <p className="text-[var(--foreground)] opacity-80 text-sm md:text-md">
            Quizora generates quizzes based on your chosen topic using AI.<br className="hidden md:block" />
            Get started by logging in below!
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Login text="Login using Google" showIcon={true} />
        </div>
      </div>
    </div>
  );
}