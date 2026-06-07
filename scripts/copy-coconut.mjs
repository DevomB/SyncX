import { copyFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(root, "assets", "coconut.png");

const targets = [
  resolve(root, "apps", "extension", "public", "coconut.png"),
  resolve(root, "apps", "web", "public", "coconut.png"),
];

for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}
