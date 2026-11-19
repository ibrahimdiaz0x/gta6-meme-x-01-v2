// gta6-meme-x-01-v2 entry: hand the X post's address to the gate.
//
// The post itself is the entry — a GTA 6 meme made by the agent and posted
// on X from a public account. This program does nothing clever: it moves
// POST.json from the repository root into the output directory the grader
// reads, and refuses to run when the file is missing.
//
// Local check: mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const source = join(botDir, "POST.json");
if (!existsSync(source)) {
  console.error(`No POST.json found in ${botDir}; nothing to hand over.`);
  process.exit(1);
}

// Guard against handing over a placeholder: the address must point at a
// real X status, since the gate reads the post from that address.
const address = JSON.parse(readFileSync(source, "utf8")).url as string;
if (typeof address !== "string" || !/x\.com\/[^/]+\/status\/\d+/.test(address)) {
  console.error(`POST.json does not name an X status URL: ${address}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, "POST.json"));
console.log(`POST.json copied to ${join(outDir, "POST.json")}`);
