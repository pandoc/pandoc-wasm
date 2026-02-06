/* pandoc-wasm: Browser entry point

   This file is used when bundling for browsers.
   It loads the WASM binary via fetch/import.
*/

import {createPandocInstance} from "./core.js"

// Load WASM file for browser
const pandocWasmModule = await import("./pandoc.wasm")
const pandocWasmLocation = pandocWasmModule.default
const pandocWasmFetch = await fetch(pandocWasmLocation)
const pandocWasm = await pandocWasmFetch.arrayBuffer()

// Create pandoc instance
const pandocInstance = await createPandocInstance(pandocWasm)

// Export the API
export const convert = pandocInstance.convert
export const query = pandocInstance.query
export const pandoc = pandocInstance.pandoc
