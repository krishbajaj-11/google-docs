"use client";

import { useState, useRef, useCallback } from "react";
import { FaCaretDown } from "react-icons/fa";
import {useStorage,useMutation} from "@liveblocks/react";

const markers = Array.from({ length: 83 }, (_, i) => i);

interface MarkerProps {
  position: number;
  isLeft: boolean;
  isDragging: boolean;
  onMouseDown: () => void;
  onDoubleClick: () => void;
}

const Marker = ({
  position,
  isLeft,
  isDragging,
  onMouseDown,
  onDoubleClick,
}: MarkerProps) => {
  return (
    <div
      className={`absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2 ${
        isDragging ? "bg-blue-100" : ""
      }`}
      style={{ [isLeft ? "left" : "right"]: `${position}px` }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* ✅ Restored the caret icon */}
      <FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
    </div>
  );
};

export const Ruler = () => {
  const  leftMargin = useStorage((root) => root.leftMargin) ?? 56;
  const setLeftMargin = useMutation(({storage},position:number) => {
    storage.set("leftMargin", position);
  }, []);
  const rightMargin = useStorage((root) => root.rightMargin) ?? 56;
  const setRightMargin = useMutation(({storage},position:number) => {
    storage.set("rightMargin", position);
  }, []);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"left" | "right" | null>(null);
  const leftMarginRef = useRef(56);
  const rightMarginRef = useRef(56);

  
  
  const [dragging, setDragging] = useState<"left" | "right" | null>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !draggingRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    if (draggingRef.current === "left") {
      const newLeft = Math.max(0, Math.min(x, 816 - rightMarginRef.current - 10));
      leftMarginRef.current = newLeft;
      setLeftMargin(newLeft);
    }

    if (draggingRef.current === "right") {
      const newRight = Math.max(0, Math.min(816 - x, 816 - leftMarginRef.current - 10));
      rightMarginRef.current = newRight;
      setRightMargin(newRight);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
    setDragging(null);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove]);

  const startDragging = (type: "left" | "right") => {
    draggingRef.current = type;
    setDragging(type);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-6 border-b border-gray-300 flex items-end relative select-none print:hidden">
      <div
        ref={containerRef}
        id="ruler-container"
        className="max-w-[816px] mx-auto w-full h-full relative"
      >
        <Marker
          position={leftMargin}
          isLeft={true}
          isDragging={dragging === "left"}
          onMouseDown={() => startDragging("left")}
          onDoubleClick={() => {
            leftMarginRef.current = 56;
            setLeftMargin(56);
          }}
        />
        <Marker
          position={rightMargin}
          isLeft={false}
          isDragging={dragging === "right"}
          onMouseDown={() => startDragging("right")}
          onDoubleClick={() => {
            rightMarginRef.current = 56;
            setRightMargin(56);
          }}
        />

        <div className="absolute inset-x-0 bottom-0 h-full">
          <div className="relative h-full w-[816px]">
            {markers.map((marker) => {
              const position = (marker * 816) / 82;
              return (
                <div key={marker} className="absolute bottom-0" style={{ left: `${position}px` }}>
                  {marker % 10 === 0 && (
                    <>
                      <div className="absolute bottom-0 w-[1px] h-2 bg-neutral-500" />
                      <span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
                        {marker / 10 + 1}
                      </span>
                    </>
                  )}
                  {marker % 5 === 0 && marker % 10 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1.5 bg-neutral-500" />
                  )}
                  {marker % 5 !== 0 && (
                    <div className="absolute bottom-0 w-[1px] h-1 bg-neutral-500" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="absolute top-0 h-full bg-blue-200/30 pointer-events-none"
          style={{ left: `${leftMargin}px`, right: `${rightMargin}px` }}
        />
      </div>
    </div>
  );
};