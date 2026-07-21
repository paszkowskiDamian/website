import type { HTMLAttributes } from "react";

export function Tag({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-accent px-[14px] py-[6px] font-mono text-label text-accent ${className ?? ""}`}
      {...props}
    />
  );
}
