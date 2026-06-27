#!/usr/bin/env node

// src/index.ts
import { Command } from "commander";

// src/lib/registry.ts
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
var DEFAULT_REGISTRY_URL = process.env.MINIKIT_REGISTRY_URL ?? "https://minikit.vercel.app/r/registry.json";
function isLocalRegistry(url) {
  return url.startsWith("file:") || !url.startsWith("http") && path.isAbsolute(url);
}
function resolveLocalRegistryPath(url) {
  if (url.startsWith("file:")) return fileURLToPath(url);
  return url;
}
async function fetchRegistry(url = DEFAULT_REGISTRY_URL) {
  if (isLocalRegistry(url)) {
    const filePath = resolveLocalRegistryPath(url);
    return fs.readJson(filePath);
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry (${res.status}): ${url}`);
  }
  return res.json();
}
async function fetchRegistryFile(registryUrl, filePath) {
  if (isLocalRegistry(registryUrl)) {
    const registryPath = resolveLocalRegistryPath(registryUrl);
    const base2 = path.dirname(registryPath);
    return fs.readFile(path.join(base2, filePath), "utf-8");
  }
  const base = registryUrl.replace(/\/registry\.json$/, "");
  const url = `${base}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  return res.text();
}
function resolveAlias(alias, cwd) {
  const withoutAt = alias.replace(/^@\//, "");
  return path.join(cwd, "src", withoutAt);
}
function rewriteImports(source, config) {
  const utilsAlias = config.aliases.utils.replace(/\/$/, "");
  const componentsAlias = (config.aliases.ui ?? config.aliases.components).replace(/\/$/, "");
  return source.replace(/from ["']@\/lib\/utils["']/g, `from "${utilsAlias}"`).replace(/from ["']@\/lib\/mk-styles["']/g, `from "${utilsAlias.replace(/utils$/, "mk-styles")}"`).replace(/from ["']@\/lib\/slider-ticks["']/g, `from "${utilsAlias.replace(/utils$/, "slider-ticks")}"`);
}
async function readComponentsConfig(cwd) {
  const configPath = path.join(cwd, "components.json");
  if (!await fs.pathExists(configPath)) {
    throw new Error("components.json not found. Run `npx minikit init` first.");
  }
  return fs.readJson(configPath);
}
function collectItems(manifest, names) {
  const byName = new Map(manifest.items.map((item) => [item.name, item]));
  const collected = /* @__PURE__ */ new Map();
  const visit = (name) => {
    if (collected.has(name)) return;
    const item = byName.get(name);
    if (!item) {
      throw new Error(`Component "${name}" not found in registry.`);
    }
    for (const dep of item.registryDependencies ?? []) {
      visit(dep);
    }
    collected.set(name, item);
  };
  for (const name of names) visit(name);
  return [...collected.values()];
}
async function writeRegistryFiles(cwd, config, items, registryUrl, fetchFile = (p) => fetchRegistryFile(registryUrl, p)) {
  const componentsDir = resolveAlias(config.aliases.components, cwd);
  const utilsPath = resolveAlias(config.aliases.utils, cwd);
  const libDir = path.dirname(utilsPath);
  await fs.ensureDir(componentsDir);
  await fs.ensureDir(libDir);
  const written = /* @__PURE__ */ new Set();
  for (const item of items) {
    for (const file of item.files) {
      if (written.has(file.path)) continue;
      written.add(file.path);
      const content = await fetchFile(file.path);
      const rewritten = rewriteImports(content, config);
      if (file.path.startsWith("lib/")) {
        const dest = path.join(libDir, path.basename(file.path));
        await fs.writeFile(dest, rewritten, "utf-8");
        console.log(`  + ${path.relative(cwd, dest)}`);
      } else if (file.path.startsWith("ui/")) {
        const dest = path.join(componentsDir, path.basename(file.path));
        await fs.writeFile(dest, rewritten, "utf-8");
        console.log(`  + ${path.relative(cwd, dest)}`);
      }
    }
  }
}
async function installDependencies(cwd, deps) {
  if (deps.length === 0) return;
  const { execSync } = await import("child_process");
  const unique = [...new Set(deps)].sort();
  console.log(`Installing: ${unique.join(", ")}`);
  execSync(`npm install ${unique.join(" ")}`, { cwd, stdio: "inherit" });
}

// src/commands/add.ts
async function runAdd(cwd, names, options) {
  const registryUrl = options.registry ?? DEFAULT_REGISTRY_URL;
  const config = await readComponentsConfig(cwd);
  const manifest = await fetchRegistry(registryUrl);
  const items = collectItems(manifest, names);
  console.log(`Adding: ${items.map((i) => i.name).join(", ")}`);
  await writeRegistryFiles(cwd, config, items, registryUrl);
  if (options.install) {
    const deps = items.flatMap((item) => item.dependencies ?? []);
    await installDependencies(cwd, deps);
  }
  console.log("\nDone.");
}

// src/commands/init.ts
import path2 from "path";
import fs2 from "fs-extra";
var DEFAULT_COMPONENTS_JSON = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "default",
  rsc: true,
  tsx: true,
  tailwind: {
    css: "src/app/globals.css"
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components"
  }
};
async function runInit(cwd, registryUrl = DEFAULT_REGISTRY_URL) {
  const configPath = path2.join(cwd, "components.json");
  if (await fs2.pathExists(configPath)) {
    console.log("components.json already exists \u2014 skipping.");
  } else {
    await fs2.writeJson(configPath, DEFAULT_COMPONENTS_JSON, { spaces: 2 });
    console.log("Created components.json");
  }
  const utilsPath = path2.join(cwd, "src/lib/utils.ts");
  if (!await fs2.pathExists(utilsPath)) {
    await fs2.ensureDir(path2.dirname(utilsPath));
    const utils = await fetchRegistryFile(registryUrl, "lib/utils.ts");
    await fs2.writeFile(utilsPath, utils, "utf-8");
    console.log("Copied src/lib/utils.ts");
  }
  const themePath = path2.join(cwd, "src/lib/minikit-theme.css");
  if (!await fs2.pathExists(themePath)) {
    try {
      const theme = await fetchRegistryFile(registryUrl, "theme.css");
      await fs2.ensureDir(path2.dirname(themePath));
      await fs2.writeFile(themePath, theme, "utf-8");
      console.log("Copied src/lib/minikit-theme.css");
      console.log('\nAdd to your layout:\n  import "@/lib/minikit-theme.css";\n  <html data-theme="tool-dark">');
    } catch {
      console.log("Theme CSS not available from registry \u2014 copy registry/theme.css manually.");
    }
  }
  console.log("\nDone. Run `npx minikit add slider` to add your first component.");
}

// src/index.ts
var program = new Command();
program.name("minikit").description("Add Minikit components to your project").version("0.1.0");
program.command("init").description("Initialize Minikit in the current project").option("-r, --registry <url>", "Registry URL", DEFAULT_REGISTRY_URL).action(async (opts) => {
  await runInit(process.cwd(), opts.registry);
});
program.command("add").description("Add one or more components").argument("<components...>", "Component names (e.g. slider toolbar)").option("-r, --registry <url>", "Registry URL", DEFAULT_REGISTRY_URL).option("--no-install", "Skip npm install for dependencies").action(async (components, opts) => {
  await runAdd(process.cwd(), components, opts);
});
program.parse();
//# sourceMappingURL=index.js.map