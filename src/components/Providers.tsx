"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
// import { ThemeProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type Props = {
    children: React.ReactNode;
}

const queryClient = new QueryClient();

const Providers = ({ children }: Props) => {
  return (
    <QueryClientProvider client={queryClient} >

      {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem> */}

        <SessionProvider>
          {children}
        </SessionProvider>

      {/* </ThemeProvider> */}

    </QueryClientProvider>
  );
};

export default Providers;