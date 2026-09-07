const PAGES_ORIGIN = "https://renew48-marketing-suite.pages.dev";

export default {
  async fetch(request: Request): Promise<Response> {
    const incoming = new URL(request.url);

    if (!incoming.pathname.startsWith("/marketing-studio")) {
      return fetch(request);
    }

    const upstream = new URL(PAGES_ORIGIN);
    const mountedPath = incoming.pathname.slice("/marketing-studio".length) || "/";
    // The browser stays mounted at /marketing-studio, while the Pages project
    // stores its built files at the origin root. HTML keeps the original path
    // so the client can identify the protected studio route; static files use
    // the origin-relative path so Pages returns the real asset instead of its
    // SPA fallback document.
    upstream.pathname = /\/marketing-studio\/(assets|campaign-library)\//.test(incoming.pathname)
      ? mountedPath
      : "/";
    upstream.search = incoming.search;

    const headers = new Headers(request.headers);
    headers.set("x-forwarded-host", incoming.host);

    const proxied = new Request(upstream, {
      method: request.method,
      headers,
      body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
      redirect: "manual",
    });

    return fetch(proxied);
  },
} satisfies ExportedHandler;
