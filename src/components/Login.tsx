"use client";
import React from "react";
import { signIn } from "next-auth/react";

type Props = { text: string };

const Login = ({ text }: Props) => {
  return (
    <button
      onClick={() => {
        signIn("google").catch(console.error);
      }}
      className="bg-transparent border-2 border-[#ff7f01] text-[#ff7f01] px-4 py-2 rounded-lg font-semibold transition-all duration-300 hover:bg-[#ff7f01] hover:text-white cursor-pointer"
    >
      {text}
    </button>
  );
};

export default Login;