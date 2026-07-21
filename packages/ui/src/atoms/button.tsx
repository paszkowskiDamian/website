import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 font-mono text-label uppercase transition-colors";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent px-[22px] py-[13px] text-white hover:bg-accent-hover",
  outline:
    "border-[1.5px] border-ink bg-transparent px-5 py-3 text-ink hover:bg-ink hover:text-paper",
};

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={`${base} ${variants[variant]} ${className ?? ""}`}
      {...props}
    />
  );
}
