/* pandoc-wasm: Node.js entry point

   This file is used when running in Node.js.
   It loads the WASM binary from the filesystem.
*/

import {readFileSync} from "node:fs"
import {dirname, join} from "node:path"
import {fileURLToPath} from "node:url"
import {createPandocInstance} from "./core.js"

// Load WASM file from filesystem
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const wasmPath = join(__dirname, "pandoc.wasm")
const pandocWasm = readFileSync(wasmPath)

// Create pandoc instance
const pandocInstance = await createPandocInstance(pandocWasm)

// Export the API
export const convert = pandocInstance.convert
export const query = pandocInstance.query
export const pandoc = pandocInstance.pandoc
