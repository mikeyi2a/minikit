/**
 * Link-tag fallback: injects the stylesheet if the CSS import wasn't
 * processed by the bundler (rare, but covers plain HTML + ESM scenarios).
 *
 * Guarded by a global flag so it only fires once regardless of how many
 * components trigger this import.
 */

declare global {
  // eslint-disable-next-line no-var
  var __MINIKIT_INJECTED__: boolean | undefined;
}

const INJECTED = "__MINIKIT_INJECTED__";

export function injectStyles() {
  if (typeof document === "undefined") return;
  if (globalThis[INJECTED]) return;
  globalThis[INJECTED] = true;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    // @ts-ignore — import.meta.url is always set in ESM bundles
    new URL("../../styles/minikit.css", import.meta.url).href;

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

injectStyles();
