/**
 * Serves the site's essay narration from R2, on the site's own origin.
 *
 * Everything except /audio/* is still served straight from static assets with no
 * Worker invocation — `run_worker_first` in wrangler.jsonc lists only that one
 * prefix. Keeping the audio same-origin is deliberate: the narration manifest
 * stores plain site-root paths ("/audio/<slug>.mp3"), so nothing in the app has
 * to know where the bytes actually live, and there is no CORS to configure.
 *
 * The mp3s are generated locally (see scripts/tts/README.md) and uploaded with
 * scripts/tts/publish.sh. They are not in git and never built on Cloudflare.
 */

interface Env {
  ASSETS: Fetcher;
  codeberg_audio: R2Bucket;
}

/** Immutable in practice: a changed essay produces a changed file at the same key,
 *  and we re-upload on publish. A day of browser caching with revalidation is the
 *  right trade for a 3 MB file people scrub around in. */
const CACHE_CONTROL = "public, max-age=86400, stale-while-revalidate=604800";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (!url.pathname.startsWith("/audio/")) {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const key = decodeURIComponent(url.pathname.slice("/audio/".length));
    if (!key || key.includes("..")) {
      return new Response("Not found", { status: 404 });
    }

    // Passing the request headers through is what gives us Range support: R2
    // parses Range/If-Range itself and hands back a partial body, which is what
    // makes seeking in the player work without downloading the whole file.
    const object = await env.codeberg_audio.get(key, { range: request.headers, onlyIf: request.headers });

    if (object === null) {
      return new Response("Not found", { status: 404 });
    }

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("accept-ranges", "bytes");
    headers.set("cache-control", CACHE_CONTROL);
    if (!headers.has("content-type")) {
      headers.set("content-type", "audio/mpeg");
    }

    // A conditional hit (If-None-Match / If-Modified-Since) comes back without a
    // body — that is a 304, not an empty 200.
    if (!("body" in object) || object.body === null) {
      return new Response(null, { status: 304, headers });
    }

    // Only answer 206 when the client actually asked for a range. R2 reports a
    // `range` on the object even for a whole-body read, so keying off that alone
    // makes every plain GET a Partial Content response.
    const range = request.headers.has("range") && "range" in object ? object.range : undefined;
    if (range && "offset" in range) {
      const offset = range.offset ?? 0;
      const length = range.length ?? object.size - offset;
      const end = offset + length - 1;
      headers.set("content-range", `bytes ${offset}-${end}/${object.size}`);
      headers.set("content-length", String(length));
      return new Response(request.method === "HEAD" ? null : object.body, { status: 206, headers });
    }

    headers.set("content-length", String(object.size));
    return new Response(request.method === "HEAD" ? null : object.body, { status: 200, headers });
  },
} satisfies ExportedHandler<Env>;
