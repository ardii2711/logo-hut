import * as React from "react";
import { cn } from "@/lib/utils";

const TextareaStitch = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "w-full p-3.5 rounded-lg bg-surface-container-low text-on-surface",
        "placeholder:text-on-surface-variant/60 font-[family-name:var(--font-plus-jakarta)]",
        "text-[0.9375rem] leading-[1.55]",
        "focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_rgba(0,106,97,0.25)]",
        "outline-none transition-all resize-y",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
TextareaStitch.displayName = "TextareaStitch";

export { TextareaStitch };
