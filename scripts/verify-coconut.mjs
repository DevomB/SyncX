import { existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coconut = resolve(root, "assets", "coconut.png");

if (!existsSync(coconut)) {
  console.error("");
  console.error("  CRITICAL: assets/coconut.png is missing.");
  console.error("  The entire project depends on it. Nice try.");
  console.error("  Put the coconut back. Now.");
  console.error("");
  process.exit(1);
}
