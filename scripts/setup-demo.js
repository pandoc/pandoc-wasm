#!/usr/bin/env node

/**
 * Setup demo by copying pandoc.wasm to demo directory
 * Run this after npm install to prepare the local demo
 */

import { existsSync, mkdirSync, copyFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const wasmSrc = resolve(root, "src", "pandoc.wasm");
const distDir = resolve(root, "demo", "dist");
const wasmDest = resolve(distDir, "pandoc.wasm");

console.log("Setting up demo...");

if (!existsSync(wasmSrc)) {
    console.error("Error: src/pandoc.wasm not found");
    console.error("Please run: npm install");
    console.error("This will download pandoc.wasm via the postinstall script");
    process.exit(1);
}

mkdirSync(distDir, { recursive: true });
copyFileSync(wasmSrc, wasmDest);
console.log("✓ Copied pandoc.wasm to demo/dist/ directory");
console.log(`\nDemo is ready!`)
console.log(`\nTo run the demo locally:`)
console.log(`  cd demo/dist`)
console.log(`  python3 -m http.server 8000`)
console.log(`  Open http://localhost:8000 in your browser`)
