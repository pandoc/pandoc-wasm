/* pandoc-wasm: Main entry point with environment detection

   This file detects whether we're running in Node.js or a browser
   and loads the appropriate implementation.
*/

// Detect environment
const isNode =
    typeof process !== "undefined" &&
    process.versions != null &&
    process.versions.node != null

// Load the appropriate implementation based on environment
let pandocModule

if (isNode) {
    // Node.js: Use the Node.js-specific entry point
    pandocModule = await import("./index.node.js")
} else {
    // Browser: Use the browser-specific entry point
    pandocModule = await import("./index.browser.js")
}

// Re-export the API
export const convert = pandocModule.convert
export const query = pandocModule.query
export const pandoc = pandocModule.pandoc
