import {
  collectItems,
  DEFAULT_REGISTRY_URL,
  fetchRegistry,
  installDependencies,
  readComponentsConfig,
  writeRegistryFiles,
} from "../lib/registry.js";

export async function runAdd(
  cwd: string,
  names: string[],
  options: { registry?: string; install: boolean },
) {
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
