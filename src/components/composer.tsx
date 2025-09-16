"use client";
import { useRef } from "react";
import { cn } from "@/lib/utils";

// TODO: Check on interaction for div rule
export function Composer({ className }: { className: string }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Need to check this rule
    // biome-ignore lint/a11y/useKeyWithClickEvents: Need to check this rule
    <div
      className={cn(
        "flex h-fit items-center rounded-2xl bg-stone-50 px-6 py-3 text-lg text-slate-950 shadow-2xs ring-1 ring-stone-900/10",
        className,
      )}
      onClick={() => void textareaRef.current?.focus()}
    >
      <textarea
        ref={textareaRef}
        placeholder="Share your thoughts"
        className="field-sizing-content size-full resize-none appearance-none outline-none focus:ring-none"
      />
    </div>
  );
}
