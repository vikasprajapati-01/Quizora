import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizora",
  description: "Create quiz and test yourself",
};

import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      {/* suppressHydrationWarning */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen pt-18`}
      >
          <Providers>
            {/* <div className="bg-yellow-200 dark:bg-green-900 p-4">Test Dark Mode</div> */}
            <Navbar />
            {children}
          </Providers>
      </body>
    </html>
  );
}