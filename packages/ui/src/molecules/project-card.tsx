import { CoverArt } from "../atoms/cover-art";

export interface ProjectCardProps {
  seed: number;
  title: string;
  description: string;
  /** When set, the whole card becomes a link (e.g. to the project's detail page). */
  href?: string;
  className?: string;
}

export function ProjectCard({ seed, title, description, href, className }: ProjectCardProps) {
  const body = (
    <>
      <CoverArt seed={seed} className="mb-3.5" />
      <div className="text-base font-bold text-ink group-hover:text-accent">{title}</div>
      <p className="mt-1 font-serif text-copy">{description}</p>
    </>
  );

  if (href) {
    return (
      <a href={href} className={`group block no-underline ${className ?? ""}`}>
        {body}
      </a>
    );
  }

  return <div className={className}>{body}</div>;
}
