import { rm } from "node:fs/promises";
import { relative, resolve } from "node:path";

const projectRoot = resolve(process.cwd());
const nextDirectory = resolve(projectRoot, ".next");
const generatedDevTypes = resolve(nextDirectory, "dev", "types");
const relativeTarget = relative(nextDirectory, generatedDevTypes);

if (relativeTarget.startsWith("..") || relativeTarget === "") {
  throw new Error("Refusing to clear a path outside .next.");
}

await rm(generatedDevTypes, { recursive: true, force: true });
