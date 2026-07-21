import { CoverArt } from "../atoms/cover-art";

export interface ProjectCardProps {
  seed: number;
  title: string;
  description: string;
  className?: string;
}

export function ProjectCard({ seed, title, description, className }: ProjectCardProps) {
  return (
    <div className={className}>
      <CoverArt seed={seed} className="mb-3.5" />
      <div className="text-base font-bold text-ink">{title}</div>
      <p className="mt-1 font-serif text-copy">{description}</p>
    </div>
  );
}
