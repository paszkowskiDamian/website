"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EssayListItem } from "@repo/ui/molecules/essay-list-item";
import type { EssayMeta } from "../../lib/content";
import type { EssaysPageConfig } from "../../lib/content";

type FiltersCopy = EssaysPageConfig["filters"];

interface EssaysIndexProps {
  essays: EssayMeta[];
  copy: FiltersCopy;
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`inline-flex items-center rounded-full border px-[14px] py-[6px] font-mono text-label transition-colors ${
        active
          ? "border-accent bg-accent text-paper"
          : "border-line text-muted hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

function FilterRow({
  label,
  allLabel,
  options,
  selected,
  onSelect,
}: {
  label: string;
  allLabel: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-2 w-[72px] flex-none font-mono text-meta uppercase text-muted">
        {label}
      </span>
      <FilterChip active={selected === null} onClick={() => onSelect(null)}>
        {allLabel}
      </FilterChip>
      {options.map((option) => (
        <FilterChip
          key={option}
          active={selected === option}
          onClick={() => onSelect(selected === option ? null : option)}
        >
          {option}
        </FilterChip>
      ))}
    </div>
  );
}

/** The plain list — also used as the Suspense fallback so the prerendered
 *  HTML contains the full, unfiltered archive. */
export function EssaysList({ essays, emptyMessage }: { essays: EssayMeta[]; emptyMessage?: string }) {
  if (essays.length === 0) {
    return (
      <p className="border-b border-line py-10 font-serif text-lede text-muted">{emptyMessage}</p>
    );
  }
  return (
    <>
      {essays.map((essay) => (
        <EssayListItem
          key={essay.slug}
          index={essay.number}
          date={essay.displayDate}
          title={essay.title}
          excerpt={essay.excerpt}
          readTime={essay.readTime}
          href={`/essays/${essay.slug}/`}
        />
      ))}
    </>
  );
}

/**
 * Client-side category/tag filtering over the static essay list.
 *
 * The active filters are mirrored into `?category=` / `?tag=` URL params so a
 * filtered view is shareable. The site is a static export, so the params are
 * read client-side via useSearchParams — the parent page wraps this component
 * in <Suspense>.
 */
export function EssaysIndex({ essays, copy }: EssaysIndexProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const categories = [...new Set(essays.map((e) => e.category))].sort();
  const tags = [...new Set(essays.flatMap((e) => e.tags))].sort();

  // Unknown values (stale or hand-edited URLs) fall back to "no filter".
  const rawCategory = searchParams.get("category");
  const rawTag = searchParams.get("tag");
  const category = rawCategory !== null && categories.includes(rawCategory) ? rawCategory : null;
  const tag = rawTag !== null && tags.includes(rawTag) ? rawTag : null;

  const setFilter = (key: "category" | "tag", value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const filtered = essays.filter(
    (e) => (category === null || e.category === category) && (tag === null || e.tags.includes(tag)),
  );

  return (
    <>
      <div className="flex flex-col gap-3 border-t-2 border-ink py-5">
        <FilterRow
          label={copy.categoriesLabel}
          allLabel={copy.allLabel}
          options={categories}
          selected={category}
          onSelect={(value) => setFilter("category", value)}
        />
        <FilterRow
          label={copy.tagsLabel}
          allLabel={copy.allLabel}
          options={tags}
          selected={tag}
          onSelect={(value) => setFilter("tag", value)}
        />
        {(category !== null || tag !== null) && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-meta uppercase text-muted" aria-live="polite">
              {filtered.length} / {essays.length}
            </span>
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="font-mono text-meta uppercase text-accent hover:text-accent-hover"
            >
              {copy.clearLabel} ✕
            </button>
          </div>
        )}
      </div>

      <EssaysList essays={filtered} emptyMessage={copy.emptyMessage} />
    </>
  );
}
