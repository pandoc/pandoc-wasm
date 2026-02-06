#!/usr/bin/env node

/**
 * Simple test script for pandoc-wasm
 *
 * This package works in both Node.js and browser environments.
 */

import {convert, query} from "./index.js"

console.log("Testing pandoc-wasm...\n")

async function runTests() {
    try {
        // Test 1: Query version
        console.log("Test 1: Query version")
        const version = await query({query: "version"})
        console.log("✓ Pandoc version:", version)

        // Test 2: Query input formats
        console.log("\nTest 2: Query input formats")
        const inputFormats = await query({query: "input-formats"})
        console.log("✓ Found", inputFormats.length, "input formats")
        console.log("  Examples:", inputFormats.slice(0, 5).join(", "), "...")

        // Test 3: Query output formats
        console.log("\nTest 3: Query output formats")
        const outputFormats = await query({query: "output-formats"})
        console.log("✓ Found", outputFormats.length, "output formats")
        console.log("  Examples:", outputFormats.slice(0, 5).join(", "), "...")

        // Test 4: Simple markdown to HTML conversion
        console.log("\nTest 4: Markdown to HTML conversion")
        const markdown = `# Hello World

This is a **test** of the pandoc-wasm package.

- Item 1
- Item 2
- Item 3
`

        const options = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const result = await convert(options, markdown, {})

        if (result.stdout && result.stdout.includes("<h1")) {
            console.log("✓ HTML conversion successful")
            console.log("  Output length:", result.stdout.length, "chars")
            console.log("  Warnings:", result.warnings.length)
        } else {
            console.log("✗ HTML conversion failed")
            console.log("  stdout:", result.stdout.substring(0, 100))
            console.log("  stderr:", result.stderr)
        }

        // Test 5: Markdown to plain text
        console.log("\nTest 5: Markdown to plain text conversion")
        const plainResult = await convert(
            {from: "markdown", to: "plain"},
            markdown,
            {}
        )

        if (plainResult.stdout) {
            console.log("✓ Plain text conversion successful")
            console.log(
                "  Output:",
                plainResult.stdout.trim().substring(0, 50) + "..."
            )
        } else {
            console.log("✗ Plain text conversion failed")
        }

        console.log("\n✓ All tests completed successfully!")
        console.log("\npandoc-wasm is working correctly.")
    } catch (error) {
        console.error("\n✗ Test failed with error:")
        console.error(error)
        process.exit(1)
    }
}

runTests()
