"use client";

import { useState, useRef, useEffect } from "react";
import ErrorDisplay from "./ErrorDisplay";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";

interface DashboardCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  error?: Error | null;
  retry?: () => void;
  onViewMore?: () => void;
  maxHeight?: string;
  isScrollable?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  icon,
  children,
  error,
  retry,
  onViewMore,
  maxHeight = "400px",
  isScrollable = false,
}) => {
  const [showScrollHint, setShowScrollHint] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setShowScrollHint(
        // contentRef.current.scrollHeight > contentRef.current.clientHeight,
        isScrollable,
      );
    }
  }, [children]);

  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-indigo-100 p-2 transition-all duration-300 group-hover:bg-indigo-200">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-800 transition-all duration-300 group-hover:text-indigo-600">
            {title}
          </h2>
        </div>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="flex items-center text-sm font-medium text-indigo-600 transition-all duration-300 hover:translate-x-1 hover:text-indigo-800"
          >
            View More
            <FaChevronRight className="ml-1" />
          </button>
        )}
      </div>
      {error ? (
        <ErrorDisplay
          message={`Failed to load ${title.toLowerCase()}`}
          retry={retry}
        />
      ) : (
        <div className="relative">
          <div
            ref={contentRef}
            className={`
              ${isScrollable ? "scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-gray-100 hover:scrollbar-thumb-indigo-500 overflow-y-auto pr-4" : "overflow-hidden"}
              ${showScrollHint ? "mask-linear-gradient" : ""}
            `}
            style={{ maxHeight: isScrollable ? maxHeight : "none" }}
          >
            {children}
          </div>
          {showScrollHint && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent py-2 text-center">
              <div className="inline-flex animate-bounce items-center text-indigo-500">
                <FaChevronDown className="mr-1" />
                <span>Scroll for more</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
