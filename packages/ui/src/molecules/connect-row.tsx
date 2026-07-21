export interface ConnectLink {
  label: string;
  href: string;
  shape?: "circle" | "square" | "rect";
}

const DEFAULT_LINKS: ConnectLink[] = [
  { label: "GitHub", href: "#", shape: "circle" },
  { label: "Dribbble", href: "#", shape: "circle" },
  { label: "LinkedIn", href: "#", shape: "square" },
  { label: "Email", href: "#", shape: "rect" },
];

export interface ConnectRowProps {
  links?: ConnectLink[];
  className?: string;
}

export function ConnectRow({ links = DEFAULT_LINKS, className }: ConnectRowProps) {
  return (
    <div className={`flex flex-wrap gap-10 ${className ?? ""}`}>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          className="inline-flex items-center gap-2.5 font-mono text-sm text-ink hover:text-accent"
        >
          <span
            aria-hidden="true"
            className={`inline-block border-[1.6px] border-current ${
              l.shape === "square"
                ? "h-5 w-5"
                : l.shape === "rect"
                  ? "h-4 w-[22px]"
                  : "h-5 w-5 rounded-full"
            }`}
          />
          {l.label}
        </a>
      ))}
    </div>
  );
}
