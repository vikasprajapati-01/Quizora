"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

type Props = {
    children: React.ReactNode;
}

const Providers = ({ children }: Props) => {
  return (
    // <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        {children}
      </SessionProvider>
    // </ThemeProvider>
  );
};

export default Providers;