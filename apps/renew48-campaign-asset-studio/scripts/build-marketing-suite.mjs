import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const nested = join(dist, "marketing-suite");

await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "build"], {
    cwd: root,
    env: { ...process.env, VITE_BASE_PATH: "/marketing-suite/" },
    stdio: "inherit",
  });
  child.on("error", reject);
  child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`vite build exited with ${code}`))));
});

await rm(nested, { recursive: true, force: true });
await mkdir(nested, { recursive: true });
for (const entry of await readdir(dist)) {
  if (entry === "marketing-suite") continue;
  await cp(join(dist, entry), join(nested, entry), { recursive: true });
  await rm(join(dist, entry), { recursive: true, force: true });
}
console.log(`Nested Pages build ready at ${nested}`);
