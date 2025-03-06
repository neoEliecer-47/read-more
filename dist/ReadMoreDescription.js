"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from "react";
import DOMpurify from 'dompurify';
const ReadMoreDescription = ({ description, title, initialHeight = 30, dangerousHtml = true, }) => {
    const [hiddenText, setHiddenText] = useState(true);
    const [dynamicHeight, setDynamicHeight] = useState(`${initialHeight}rem`);
    const [maxLength, setMaxLength] = useState(380);
    const readMoreRef = useRef(null);
    const previousWidth = useRef(null);
    useEffect(() => {
        const element = readMoreRef.current;
        if (!element)
            return;
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            if (previousWidth.current === width)
                return;
            previousWidth.current = width;
            setMaxLength(width < 400 ? 115 : width < 700 ? 250 : 380);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);
    const truncatedText = description.slice(0, maxLength);
    const shouldTruncate = description.length > maxLength;
    const textContent = hiddenText ? truncatedText + (shouldTruncate ? "..." : "") : description;
    const sinitizedHtml = useMemo(() => DOMpurify.sanitize(textContent), [textContent]);
    useEffect(() => {
        if (readMoreRef.current) {
            requestAnimationFrame(() => {
                setDynamicHeight(hiddenText ? `${initialHeight}rem` : `${readMoreRef.current.scrollHeight}px`);
            });
        }
    }, [hiddenText, initialHeight]);
    return (_jsx("div", { className: "max-w-[80rem] px-4 lg:px-8", children: _jsxs("div", { ref: readMoreRef, className: "relative bg-black/90 text-white p-2 rounded-lg overflow-hidden transition-all", style: { height: dynamicHeight, maxWidth: "100%", transition: "height 200ms ease" }, children: [_jsx("div", { className: "w-full break-words text-white", style: { wordBreak: "break-word", whiteSpace: "normal" }, children: dangerousHtml ? (_jsx("div", { dangerouslySetInnerHTML: { __html: sinitizedHtml } })) : (_jsx("div", { children: textContent })) }), shouldTruncate && (_jsx("button", { "aria-expanded": !hiddenText, onClick: (e) => {
                        e.stopPropagation();
                        setHiddenText(!hiddenText);
                    }, className: "absolute bottom-1 right-2 px-3 py-1 text-xs font-semibold text-white bg-purple-500 rounded-md hover:bg-purple-400 transition-all focus:outline-none", children: hiddenText ? "Read More" : "Show Less" }))] }) }));
};
export default ReadMoreDescription;
