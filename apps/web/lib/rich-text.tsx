import type { ReactNode } from "react";
import { Fragment } from "react";

/**
 * Renders a content string with `**bold**` spans as
 * `<strong className="font-semibold">`. The only inline markup the
 * content files use — anything heavier belongs in MDX.
 */
export function richText(text: string): ReactNode {
  return text.split("**").map((part, i) => (
    <Fragment key={i}>
      {i % 2 === 1 ? <strong className="font-semibold">{part}</strong> : part}
    </Fragment>
  ));
}
