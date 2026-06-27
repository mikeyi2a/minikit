import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "fs-extra";

export const DEFAULT_REGISTRY_URL =
  process.env.MINIKIT_REGISTRY_URL ?? "https://minikit-flax.vercel.app/r/registry.json";

export interface RegistryFile {
  path: string;
  type: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files: RegistryFile[];
  dependencies?: string[];
  registryDependencies?: string[];
}

export interface RegistryManifest {
  name: string;
  homepage?: string;
  items: RegistryItem[];
}

export interface ComponentsConfig {
  aliases: {
    components: string;
    utils: string;
    ui?: string;
  };
  tailwind?: {
    css?: string;
  };
}

function isLocalRegistry(url: string): boolean {
  return url.startsWith("file:") || (!url.startsWith("http") && path.isAbsolute(url));
}

function resolveLocalRegistryPath(url: string): string {
  if (url.startsWith("file:")) return fileURLToPath(url);
  return url;
}

export async function fetchRegistry(url = DEFAULT_REGISTRY_URL): Promise<RegistryManifest> {
  if (isLocalRegistry(url)) {
    const filePath = resolveLocalRegistryPath(url);
    return fs.readJson(filePath) as Promise<RegistryManifest>;
  }
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch registry (${res.status}): ${url}`);
  }
  return res.json() as Promise<RegistryManifest>;
}

export async function fetchRegistryFile(registryUrl: string, filePath: string): Promise<string> {
  if (isLocalRegistry(registryUrl)) {
    const registryPath = resolveLocalRegistryPath(registryUrl);
    const base = path.dirname(registryPath);
    return fs.readFile(path.join(base, filePath), "utf-8");
  }
  const base = registryUrl.replace(/\/registry\.json$/, "");
  const url = `${base}/${filePath}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${url} (${res.status})`);
  }
  return res.text();
}

export function resolveAlias(alias: string, cwd: string): string {
  const withoutAt = alias.replace(/^@\//, "");
  return path.join(cwd, "src", withoutAt);
}

export function rewriteImports(
  source: string,
  config: ComponentsConfig,
): string {
  const utilsAlias = config.aliases.utils.replace(/\/$/, "");
  const componentsAlias = (config.aliases.ui ?? config.aliases.components).replace(/\/$/, "");

  return source
    .replace(/from ["']@\/lib\/utils["']/g, `from "${utilsAlias}"`)
    .replace(/from ["']@\/lib\/mk-styles["']/g, `from "${utilsAlias.replace(/utils$/, "mk-styles")}"`)
    .replace(/from ["']@\/lib\/slider-ticks["']/g, `from "${utilsAlias.replace(/utils$/, "slider-ticks")}"`);
}

export async function readComponentsConfig(cwd: string): Promise<ComponentsConfig> {
  const configPath = path.join(cwd, "components.json");
  if (!(await fs.pathExists(configPath))) {
    throw new Error("components.json not found. Run `npx minikit init` first.");
  }
  return fs.readJson(configPath);
}

export function collectItems(
  manifest: RegistryManifest,
  names: string[],
): RegistryItem[] {
  const byName = new Map(manifest.items.map((item) => [item.name, item]));
  const collected = new Map<string, RegistryItem>();

  const visit = (name: string) => {
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

export async function writeRegistryFiles(
  cwd: string,
  config: ComponentsConfig,
  items: RegistryItem[],
  registryUrl: string,
  fetchFile: (filePath: string) => Promise<string> = (p) => fetchRegistryFile(registryUrl, p),
) {
  const componentsDir = resolveAlias(config.aliases.components, cwd);
  const utilsPath = resolveAlias(config.aliases.utils, cwd);
  const libDir = path.dirname(utilsPath);
  await fs.ensureDir(componentsDir);
  await fs.ensureDir(libDir);

  const written = new Set<string>();

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

export async function installDependencies(cwd: string, deps: string[]) {
  if (deps.length === 0) return;
  const { execSync } = await import("node:child_process");
  const unique = [...new Set(deps)].sort();
  console.log(`Installing: ${unique.join(", ")}`);
  execSync(`npm install ${unique.join(" ")}`, { cwd, stdio: "inherit" });
}
