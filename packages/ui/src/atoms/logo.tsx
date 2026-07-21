import type { SVGProps } from "react";

export const BERG_PATH =
  "M216.458 183.145C216.789 184.249 216.458 185.447 215.605 186.224L151.133 245L70.752 186.233C69.7063 185.469 69.2698 184.119 69.669 182.887L99.1699 91.8154L173.82 41L216.458 183.145ZM79.5674 181.529L146.633 230.561V160.374L104.165 105.602L79.5674 181.529ZM155.633 159.258V228.718L206.752 182.115L172.937 69.3838L155.633 159.258ZM108.422 96.4053L148.594 148.216L166.134 57.1191L108.422 96.4053Z";

interface MarkProps
  extends Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> {
  /** Fill color for the mark. Defaults to the current text color. */
  color?: string;
}

/** The codeberg mark — a faceted berg: mountain, prism, and cursor caret at once. */
export function Mark({ color = "currentColor", className, ...props }: MarkProps) {
  return (
    <svg viewBox="69 41 148 205" fill="none" className={className} {...props}>
      <path d={BERG_PATH} fill={color} />
    </svg>
  );
}

interface LogoProps {
  className?: string;
  markClassName?: string;
  color?: string;
  /** Show the "codeberg" wordmark next to the mark. Defaults to true. */
  wordmark?: boolean;
}

/** Horizontal lockup: mark + wordmark. Pass `wordmark={false}` for the mark alone. */
export function Logo({
  className,
  markClassName,
  color,
  wordmark = true,
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Mark color={color} className={`h-9 w-6 flex-none ${markClassName ?? ""}`} />
      {wordmark && (
        <span className="text-xl font-semibold tracking-[0.04em]">codeberg</span>
      )}
    </span>
  );
}
