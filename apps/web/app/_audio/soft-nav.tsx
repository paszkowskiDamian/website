"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Turn same-origin anchor clicks into client-side navigations.
 *
 * `@repo/ui` renders plain `<a href>` on purpose — it is framework-agnostic and
 * Storybook renders it outside Next. That is a good decision and this component
 * exists so we don't have to reverse it: a full page load would tear down the
 * React tree, and with it the single <audio> element that lets narration keep
 * playing while the reader moves between essays.
 *
 * Anything that isn't an ordinary left-click on an ordinary internal link is
 * left completely alone, so the browser's own behaviour remains the default.
 */
export function SoftNavLinks() {
  const router = useRouter();

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      // Opt-out hatch for any link that must do a real navigation.
      if (anchor.dataset.nativeNav !== undefined) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.getAttribute("rel")?.includes("external")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      // A pure hash change on the current page is the browser's job.
      if (url.pathname === window.location.pathname && url.hash) return;

      event.preventDefault();
      router.push(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
