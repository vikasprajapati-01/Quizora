"use client";

import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  formattedTopics: { text: string; value: number }[];
};

const WordCloud = ({ formattedTopics }: Props) => {
  const router = useRouter();

  // Sort topics by value (descending)
  const sortedTopics = [...formattedTopics].sort((a, b) => b.value - a.value);
  
  // Scale font size between min and max values
  const maxValue = Math.max(...formattedTopics.map(topic => topic.value));
  const minValue = Math.min(...formattedTopics.map(topic => topic.value)) || 1;
  
  const getFontSize = (value: number) => {
    const minFont = window.innerWidth < 640 ? 12 : 14;
    const maxFont = window.innerWidth < 640 ? 24 : 32;
    
    if (maxValue === minValue) return minFont + (maxFont - minFont) / 2;
    
    const normalized = (value - minValue) / (maxValue - minValue);
    return minFont + normalized * (maxFont - minFont);
  };
  
  // Get opacity based on value (higher value = higher opacity)
  const getOpacity = (value: number) => {
    return 0.5 + (value / maxValue) * 0.5;
  };

  return (
    <div className="flex flex-wrap justify-center gap-1 sm:gap-2 md:gap-3 py-2 sm:py-4">
      {sortedTopics.map((topic, index) => (
        <div
          key={index}
          style={{
            fontSize: `${getFontSize(topic.value)}px`,
            opacity: getOpacity(topic.value),
          }}
          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full cursor-pointer text-gray-800 dark:text-white hover:bg-[#ff7f01]/10 dark:hover:bg-[#ff7f01]/20 hover:text-[#ff7f01] transition-all duration-200"
          onClick={() => router.push(`/quiz?topic=${encodeURIComponent(topic.text)}`)}
        >
          {topic.text}
        </div>
      ))}
  </div>
  );
};

export default WordCloud;