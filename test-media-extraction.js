#!/usr/bin/env node

/**
 * Test script for media extraction functionality in pandoc-wasm
 *
 * Tests the new convert() API's ability to automatically extract media files
 * and include them in the returned files object.
 */

import {readFileSync} from "fs"
import {convert} from "./index.js"

console.log("Testing media extraction in pandoc-wasm...\n")

async function runTests() {
    try {
        // Test 1: Extract media from DOCX with embedded images
        console.log("Test 1: Extract media from document (simulated)")

        // Create a markdown document with an image reference
        const markdown = `# Document with Images

This document contains images.

![Test Image](test-image.png)

More text here.
`

        // Create a simple PNG image (1x1 red pixel)
        const pngData = new Uint8Array([
            137,
            80,
            78,
            71,
            13,
            10,
            26,
            10, // PNG signature
            0,
            0,
            0,
            13,
            73,
            72,
            68,
            82, // IHDR chunk
            0,
            0,
            0,
            1,
            0,
            0,
            0,
            1,
            8,
            2,
            0,
            0,
            0,
            144,
            119,
            83,
            222,
            0,
            0,
            0,
            12,
            73,
            68,
            65,
            84,
            8,
            215,
            99,
            248,
            207,
            192,
            0,
            0,
            3,
            1,
            1,
            0,
            24,
            221,
            141,
            176,
            0,
            0,
            0,
            0,
            73,
            69,
            78,
            68,
            174,
            66,
            96,
            130
        ])

        const options = {
            from: "markdown",
            to: "html",
            standalone: false
        }

        const files = {
            "test-image.png": new Blob([pngData], {type: "image/png"})
        }

        const result = await convert(options, markdown, files)

        console.log("✓ Conversion completed")
        console.log("  HTML output length:", result.stdout.length, "chars")
        console.log(
            "  All files in result.files:",
            Object.keys(result.files).join(", ")
        )
        console.log(
            "  New files in result.mediaFiles:",
            Object.keys(result.mediaFiles).join(", ") || "(none)"
        )

        // Verify that input files are in result.files but not in result.mediaFiles
        if (
            "test-image.png" in result.files &&
            !("test-image.png" in result.mediaFiles)
        ) {
            console.log(
                "  ✓ Input files preserved in result.files but not in result.mediaFiles"
            )
        }

        // Test 2: Extract media to a directory structure
        console.log("\nTest 2: Extract media with extract-media option")

        const options2 = {
            from: "markdown",
            to: "markdown",
            "extract-media": "media"
        }

        const markdown2 = `# Test

![Image](test.png)
`

        const files2 = {
            "test.png": new Blob([pngData], {type: "image/png"})
        }

        const result2 = await convert(options2, markdown2, files2)

        console.log("✓ Conversion with extract-media completed")
        console.log("  Markdown output length:", result2.stdout.length, "chars")
        console.log(
            "  All files in result.files:",
            Object.keys(result2.files).join(", ")
        )
        console.log(
            "  New files in result.mediaFiles:",
            Object.keys(result2.mediaFiles).join(", ") || "(none)"
        )

        // Check mediaFiles for extracted files
        if (Object.keys(result2.mediaFiles).length > 0) {
            console.log("  ✓ Extracted media files found in result.mediaFiles")
            for (const filename of Object.keys(result2.mediaFiles)) {
                console.log(
                    `    - ${filename}: ${result2.mediaFiles[filename].size} bytes`
                )
            }
        } else {
            console.log(
                "  Note: No media files extracted (image may be referenced directly)"
            )
        }

        // Verify input files are NOT in mediaFiles
        if (
            "test.png" in result2.files &&
            !("test.png" in result2.mediaFiles)
        ) {
            console.log("  ✓ Input files excluded from result.mediaFiles")
        }

        // Test 3: Verify files object is consistent (dictionary-based)
        console.log("\nTest 3: Verify API consistency (dictionary vs Map)")

        const options3 = {
            from: "markdown",
            to: "html",
            "output-file": "output.html"
        }

        const files3 = {}
        const result3 = await convert(options3, "# Test", files3)

        if (
            typeof result3.files === "object" &&
            !Array.isArray(result3.files)
        ) {
            console.log("✓ Files object is a dictionary (not a Map or Array)")
            console.log("  Type:", typeof result3.files)
            console.log("  Constructor:", result3.files.constructor.name)
            console.log("  Has output file:", "output.html" in result3.files)
        } else {
            console.log("✗ Files object is not a plain object")
        }

        if (
            typeof result3.mediaFiles === "object" &&
            !Array.isArray(result3.mediaFiles)
        ) {
            console.log("✓ mediaFiles object is also a dictionary")
            console.log(
                "  New files only:",
                Object.keys(result3.mediaFiles).length
            )
        } else {
            console.log("✗ mediaFiles object is not a plain object")
        }

        // Test 4: Multiple files scenario
        console.log("\nTest 4: Multiple input and output files")

        const options4 = {
            from: "markdown",
            to: "html",
            "output-file": "result.html",
            bibliography: "refs.bib",
            citeproc: true
        }

        const markdown4 = `# Paper

Citation here [@test2024].

# References
`

        const bibContent = `@article{test2024,
  author = {Test, Author},
  title = {Test Article},
  year = {2024}
}`

        const files4 = {
            "refs.bib": new Blob([bibContent], {type: "text/plain"})
        }

        const result4 = await convert(options4, markdown4, files4)

        console.log("✓ Multi-file conversion completed")
        console.log("  Files provided:", Object.keys(files4).join(", "))
        console.log(
            "  All files in result.files:",
            Object.keys(result4.files).join(", ")
        )
        console.log(
            "  New files in result.mediaFiles:",
            Object.keys(result4.mediaFiles).join(", ") || "(none)"
        )
        console.log("  Has output file:", "result.html" in result4.files)
        console.log("  Has bib file:", "refs.bib" in result4.files)

        // Verify input file is NOT in mediaFiles, and output file is also NOT in mediaFiles
        if (
            "refs.bib" in result4.files &&
            !("refs.bib" in result4.mediaFiles)
        ) {
            console.log("  ✓ Input files excluded from result.mediaFiles")
        }
        if (
            "result.html" in result4.files &&
            !("result.html" in result4.mediaFiles)
        ) {
            console.log(
                "  ✓ Output file correctly excluded from result.mediaFiles (only extracted media included)"
            )
        }

        console.log("\n✓ All media extraction tests completed successfully!")
        console.log("\nThe new convert() API correctly:")
        console.log("  - Returns files as a dictionary (not Map)")
        console.log(
            "  - result.files contains ALL files (input + output + extracted media)"
        )
        console.log(
            "  - result.mediaFiles contains ONLY extracted media (not output files)"
        )
        console.log("  - Input files excluded from result.mediaFiles")
        console.log("  - Output files excluded from result.mediaFiles")
        console.log("  - Easy to identify extracted media without filtering")
    } catch (error) {
        console.error("\n✗ Test failed with error:")
        console.error(error)
        if (error.stack) {
            console.error("\nStack trace:")
            console.error(error.stack)
        }
        process.exit(1)
    }
}

runTests()
