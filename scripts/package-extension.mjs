import { createWriteStream, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import archiver from "archiver";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const distDir = resolve(root, "apps", "extension", "dist");
const outZip = resolve(root, "syncx-extension.zip");

execSync("pnpm --filter @syncx/shared build", { cwd: root, stdio: "inherit" });
execSync("pnpm --filter @syncx/extension build", { cwd: root, stdio: "inherit" });

if (!existsSync(distDir)) {
  console.error("Extension dist folder not found:", distDir);
  process.exit(1);
}

await new Promise((resolvePromise, reject) => {
  const output = createWriteStream(outZip);
  const archive = archiver("zip", { zlib: { level: 9 } });

  output.on("close", () => {
    console.log(`Packaged ${archive.pointer()} bytes → ${outZip}`);
    resolvePromise();
  });

  archive.on("error", reject);
  archive.pipe(output);
  archive.directory(distDir, false);
  archive.finalize();
});
