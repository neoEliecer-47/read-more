"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify"

const ReadMoreDescription = ({
  description,
  title,
  initialHeight = 30,
  dangerousHtml = true,
}: {
  description: string;
  title?: string;
  initialHeight: number;
  dangerousHtml?: boolean;
}) => {
  const [hiddenText, setHiddenText] = useState(true);
  const [dynamicHeight, setDynamicHeight] = useState(`${initialHeight}rem`);
  const [maxLength, setMaxLength] = useState(380);
  const readMoreRef = useRef<HTMLDivElement>(null);
  const previousWidth = useRef<number | null>(null);

  useEffect(() => {
    const element = readMoreRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      if (previousWidth.current === width) return;
      previousWidth.current = width;

      setMaxLength(width < 400 ? 115 : width < 700 ? 250 : 380);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const truncatedText = description.slice(0, maxLength);
  const shouldTruncate = description.length > maxLength;

  const textContent = hiddenText ? truncatedText + (shouldTruncate ? "..." : "") : description;
 

  const sinitizedHtml = useMemo(()=> DOMPurify.sanitize(textContent), [textContent])

  useEffect(() => {
    if (readMoreRef.current) {
      requestAnimationFrame(() => {
        setDynamicHeight(
          hiddenText ? `${initialHeight}rem` : `${readMoreRef.current!.scrollHeight}px`
        );
      });
    }
  }, [hiddenText, initialHeight]);

  return (
    <div className="max-w-[80rem] px-4 lg:px-8">
      <div
        ref={readMoreRef}
        className="relative bg-black/90 text-white p-2 rounded-lg overflow-hidden"
        style={{ height: dynamicHeight, maxWidth: "100%", transition: "height 200ms ease" }}
      >
        <div
          className="w-full break-words text-white"
          style={{ wordBreak: "break-word", whiteSpace: "normal" }}
        >
          {dangerousHtml ? (
            <div dangerouslySetInnerHTML={{ __html: sinitizedHtml }} />
          ) : (
            <div>{textContent}</div>
          )}
        </div>

        {shouldTruncate && (
          <button
            aria-expanded={!hiddenText}
            onClick={(e) => {
              e.stopPropagation();
              setHiddenText(!hiddenText);
            }}
            className="absolute bottom-1 right-2 px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-400 transition-all focus:outline-none"
          >
            {hiddenText ? "Read More" : "Show Less"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ReadMoreDescription;