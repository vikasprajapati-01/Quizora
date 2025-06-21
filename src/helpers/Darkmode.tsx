
"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const Darkmode = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Render a placeholder while mounting to avoid hydration mismatch
    return (
      <button
        aria-label="Loading theme toggle"
        className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 transition-colors duration-200"
      >
        <div className="h-5 w-5"></div>
      </button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle Dark Mode"
      className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
    >
      {currentTheme === "dark" ? (
        <FaSun className="h-5 w-5 text-[#ff7f01]" />
      ) : (
        <FaMoon className="h-5 w-5 text-[#ff7f01]" />
      )}
      <span className="sr-only">
        {currentTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </button>
  );
};

export default Darkmode;