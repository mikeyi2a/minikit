import path from "node:path";
import fs from "fs-extra";
import type { ComponentsConfig } from "../lib/registry.js";
import { DEFAULT_REGISTRY_URL, fetchRegistryFile } from "../lib/registry.js";

const DEFAULT_COMPONENTS_JSON: ComponentsConfig & { $schema: string; style: string; rsc: boolean; tsx: boolean } = {
  $schema: "https://ui.shadcn.com/schema.json",
  style: "default",
  rsc: true,
  tsx: true,
  tailwind: {
    css: "src/app/globals.css",
  },
  aliases: {
    components: "@/components",
    utils: "@/lib/utils",
    ui: "@/components",
  },
};

export async function runInit(cwd: string, registryUrl = DEFAULT_REGISTRY_URL) {
  const configPath = path.join(cwd, "components.json");

  if (await fs.pathExists(configPath)) {
    console.log("components.json already exists — skipping.");
  } else {
    await fs.writeJson(configPath, DEFAULT_COMPONENTS_JSON, { spaces: 2 });
    console.log("Created components.json");
  }

  const utilsPath = path.join(cwd, "src/lib/utils.ts");
  if (!(await fs.pathExists(utilsPath))) {
    await fs.ensureDir(path.dirname(utilsPath));
    const utils = await fetchRegistryFile(registryUrl, "lib/utils.ts");
    await fs.writeFile(utilsPath, utils, "utf-8");
    console.log("Copied src/lib/utils.ts");
  }

  const themePath = path.join(cwd, "src/lib/minikit-theme.css");
  if (!(await fs.pathExists(themePath))) {
    try {
      const theme = await fetchRegistryFile(registryUrl, "theme.css");
      await fs.ensureDir(path.dirname(themePath));
      await fs.writeFile(themePath, theme, "utf-8");
      console.log("Copied src/lib/minikit-theme.css");
      console.log('\nAdd to your layout:\n  import "@/lib/minikit-theme.css";\n  <html data-theme="tool-dark">');
    } catch {
      console.log("Theme CSS not available from registry — copy registry/theme.css manually.");
    }
  }

  console.log("\nDone. Run `npx minikit add slider` to add your first component.");
}
