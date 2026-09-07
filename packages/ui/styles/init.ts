/**
 * Auto-injects the minikit stylesheet.
 *
 * Two mechanisms:
 *   1. Bundlers (Vite, Next.js, webpack): `import "./minikit.css"` is
 *      extracted and bundled automatically — no link tag needed.
 *   2. If CSS import isn't processed (plain HTML + ESM, etc.): inject a
 *      <link> tag as a fallback. Guarded by a global flag so it only
 *      fires once even when multiple components import this module.
 *
 * Pattern used by Mapbox GL, Leaflet, and other self-initializing packages.
 */

declare global {
  // eslint-disable-next-line no-var
  var __MINIKIT_INJECTED__: boolean | undefined;
}

// Bundle the CSS — bundlers handle this automatically (Vite, Next.js, webpack)
export { default as minikitStyles } from "./minikit.css";

const INJECTED = "__MINIKIT_INJECTED__";

function injectLink() {
  if (typeof document === "undefined") return;
  if (globalThis[INJECTED]) return;
  globalThis[INJECTED] = true;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    // @ts-ignore — import.meta.url is always available in ESM bundles
    new URL("./minikit.css", import.meta.url).href;

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => document.head.appendChild(link),
      { once: true },
    );
  } else {
    document.head.appendChild(link);
  }
}

// Only run in browser (not during SSR)
injectLink();
