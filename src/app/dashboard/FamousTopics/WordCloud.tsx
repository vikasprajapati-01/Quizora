"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const WordCloud = ({ formattedTopics }: Props) => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState<number>(0);

  // Sort topics by value (descending)
  const sortedTopics = [...formattedTopics].sort((a, b) => b.value - a.value);
  
  // Scale font size between min and max values
  const maxValue = Math.max(...formattedTopics.map(topic => topic.value));
  const minValue = Math.min(...formattedTopics.map(topic => topic.value)) || 1;
  
  // Set up window width detection on client side only
  useEffect(() => {
    // Set the initial window width
    setWindowWidth(window.innerWidth);
    
    // Update windowWidth when the window is resized
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const getFontSize = (value: number) => {
    // More responsive font sizes for different screen widths
    const minFont = windowWidth < 400 ? 10 : windowWidth < 640 ? 12 : 14;
    const maxFont = windowWidth < 400 ? 18 : windowWidth < 640 ? 22 : 30;
    
    if (maxValue === minValue) return minFont + (maxFont - minFont) / 2;
    
    const normalized = (value - minValue) / (maxValue - minValue);
    return minFont + normalized * (maxFont - minFont);
  };
  
  // Get opacity based on value (higher value = higher opacity)
  const getOpacity = (value: number) => {
    return 0.5 + (value / maxValue) * 0.5;
  };

  // Default font sizes for server-side rendering before client hydration
  const getDefaultFontSize = (value: number) => {
    const minFont = 14;
    const maxFont = 30;
    
    if (maxValue === minValue) return minFont + (maxFont - minFont) / 2;
    
    const normalized = (value - minValue) / (maxValue - minValue);
    return minFont + normalized * (maxFont - minFont);
  };

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 py-2 sm:py-3 md:py-4">
      {sortedTopics.map((topic, index) => (
        <div
          key={index}
          style={{
            fontSize: `${windowWidth === 0 ? getDefaultFontSize(topic.value) : getFontSize(topic.value)}px`,
            opacity: getOpacity(topic.value),
          }}
          className="px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 rounded-full cursor-pointer text-gray-800 dark:text-white hover:bg-[#ff7f01]/10 dark:hover:bg-[#ff7f01]/20 hover:text-[#ff7f01] transition-all duration-200"
          onClick={() => router.push(`/quiz?topic=${encodeURIComponent(topic.text)}`)}
        >
          {topic.text}
        </div>
      ))}
    </div>
  );
};

export default WordCloud;