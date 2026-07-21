import type { HTMLAttributes } from "react";

/** Centers content at the brand's 1180px page width with the standard gutter. */
export function Container({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`mx-auto max-w-page px-gutter ${className ?? ""}`} {...props} />
  );
}
