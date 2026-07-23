import { isValidElement } from "react";
import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import { CodeBlock } from "@repo/ui/atoms/code-block";
import { QuoteBlock } from "@repo/ui/atoms/quote-block";

/**
 * Maps markdown/MDX elements onto the essay typography from the design
 * handoff (codeberg Essay.dc.html). The drop cap on the opening paragraph
 * is applied by the article container, not here.
 */

const BODY_TEXT = "mb-6 font-serif text-[19px] leading-[1.65] text-[#1a1a1a]";

function Figure({ src, alt, title }: ComponentProps<"img">) {
  return (
    <figure className="my-10">
      <div className="relative aspect-[3/2] overflow-hidden">
        <img
          src={src}
          alt={alt ?? ""}
          className="absolute inset-0 h-full w-full object-cover grayscale"
        />
      </div>
      {title && <figcaption className="mt-3 font-mono text-xs text-muted">{title}</figcaption>}
    </figure>
  );
}

/** Available inside MDX as <PullQuote quote="…" attribution="…" /> */
function PullQuote({ quote, attribution }: { quote: string; attribution?: string }) {
  return <QuoteBlock quote={quote} attribution={attribution} className="my-10" />;
}

export const mdxComponents: MDXComponents = {
  p: ({ children, ...props }: { children?: ReactNode }) => {
    // Markdown wraps a standalone image in a paragraph; our img mapping
    // renders a <figure>, which is invalid inside <p> — unwrap it.
    const kids = Array.isArray(children) ? children : [children];
    const meaningful = kids.filter((k) => !(typeof k === "string" && k.trim() === ""));
    if (
      meaningful.length === 1 &&
      isValidElement(meaningful[0]) &&
      (meaningful[0].type === Figure ||
        typeof (meaningful[0].props as { src?: unknown }).src === "string")
    ) {
      return <>{meaningful[0]}</>;
    }
    return (
      <p className={BODY_TEXT} {...props}>
        {children}
      </p>
    );
  },
  h2: (props) => (
    <h2 className="mt-12 mb-[18px] text-h2 font-extrabold tracking-[-0.02em] text-ink" {...props} />
  ),
  h3: (props) => (
    <h3 className="mt-10 mb-3.5 text-h3 font-bold tracking-[-0.01em] text-ink" {...props} />
  ),
  ul: (props) => (
    <ul className={`${BODY_TEXT} list-disc space-y-3.5 pl-5 leading-[1.55]`} {...props} />
  ),
  ol: ({ children, ...props }: { children?: ReactNode }) => (
    <ol
      className={`${BODY_TEXT} numbered-list list-none space-y-3.5 p-0 leading-[1.55]`}
      {...props}
    >
      {children}
    </ol>
  ),
  li: (props) => <li {...props} />,
  a: (props) => <a className="text-accent hover:text-accent-hover" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className="my-10 border-l-[3px] border-accent pl-6 font-serif text-[22px] italic leading-[1.45] text-ink [&>p]:mb-0 [&>p]:text-[22px] [&>p]:italic [&>p]:text-ink">
      {children}
    </blockquote>
  ),
  pre: ({ children }: { children?: ReactNode }) => (
    <CodeBlock className="mb-6 text-[13.5px] leading-[1.7] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </CodeBlock>
  ),
  code: (props) => (
    <code className="rounded-xs bg-line/60 px-1.5 py-0.5 font-mono text-[0.85em]" {...props} />
  ),
  img: Figure,
  hr: () => <hr className="my-10 border-line" />,
  PullQuote,
};
