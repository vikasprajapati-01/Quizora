"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

const DarkModeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  // For debugging
  useEffect(() => {
    console.log("Current theme:", theme);
    console.log("Resolved theme:", resolvedTheme);
  }, [theme, resolvedTheme]);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    console.log("Toggle clicked. Current theme:", theme);
    const newTheme = theme === "dark" || resolvedTheme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return (
      <button 
        aria-label="Loading theme toggle"
        className="w-9 h-9 md:w-10 md:h-10 mr-5 flex items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-800 transition-colors duration-200"
      >
        <div className="h-5 w-5"></div>
      </button>
    );
  }

  // Use resolvedTheme to handle system preference correctly
  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      className="w-9 h-9 md:w-10 md:h-10 mr-5 flex items-center justify-center rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
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

export default DarkModeToggle;