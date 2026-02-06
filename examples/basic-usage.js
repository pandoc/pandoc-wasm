// Basic usage examples for pandoc-wasm

import {convert, pandoc, query} from "../index.js"

// Example 1: Simple markdown to HTML conversion
async function example1() {
    console.log("Example 1: Markdown to HTML")

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const markdown = `# Hello World

This is a **bold** statement and this is *italic*.

- Item 1
- Item 2
- Item 3
`

    const result = await convert(options, markdown, {})
    console.log("HTML Output:", result.stdout)
    console.log("Warnings:", result.warnings)
}

// Example 2: Query pandoc version and formats
async function example2() {
    console.log("\nExample 2: Query pandoc information")

    // Get version
    const version = await query({query: "version"})
    console.log("Pandoc version:", version)

    // Get input formats
    const inputFormats = await query({query: "input-formats"})
    console.log("Input formats:", inputFormats.slice(0, 5), "... and more")

    // Get output formats
    const outputFormats = await query({query: "output-formats"})
    console.log("Output formats:", outputFormats.slice(0, 5), "... and more")

    // Get extensions for markdown
    const extensions = await query({
        query: "extensions-for-format",
        format: "markdown"
    })
    console.log(
        "Markdown extensions (first 5):",
        Object.keys(extensions).slice(0, 5)
    )
}

// Example 3: Convert with bibliography
async function example3() {
    console.log("\nExample 3: Convert with bibliography")

    const markdown = `# Research Paper

According to recent studies [@smith2020], this is important.

# References
`

    const bibContent = `@article{smith2020,
  author = {Smith, John},
  title = {Important Research},
  journal = {Science Journal},
  year = {2020}
}`

    const options = {
        from: "markdown",
        to: "html",
        standalone: true,
        citeproc: true,
        bibliography: "references.bib"
    }

    const files = {
        "references.bib": new Blob([bibContent])
    }

    const result = await convert(options, markdown, files)
    console.log("HTML with citations:", result.stdout.substring(0, 200) + "...")
}

// Example 4: Generate DOCX file
async function example4() {
    console.log("\nExample 4: Generate DOCX file")

    const markdown = `# My Document

This is a paragraph with **bold** and *italic* text.

## Subsection

- List item 1
- List item 2
`

    const options = {
        from: "markdown",
        to: "docx",
        "output-file": "output.docx",
        standalone: true
    }

    const files = {}
    const result = await convert(options, markdown, files)

    // The DOCX file is now in result.files['output.docx']
    const docxBlob = result.files["output.docx"]
    console.log("DOCX file generated, size:", docxBlob.size, "bytes")

    // In browser: you could create a download link
    // In Node.js: you could write it to disk
    // const arrayBuffer = await docxBlob.arrayBuffer();
    // fs.writeFileSync('output.docx', Buffer.from(arrayBuffer));
}

// Example 5: Legacy API (backward compatibility)
async function example5() {
    console.log("\nExample 5: Legacy API")

    const output = await pandoc(
        "-f markdown -t html -s",
        "# Hello from Legacy API\n\nThis uses the old interface.",
        []
    )

    console.log("Legacy output:", output.out.substring(0, 100) + "...")
}

// Example 6: Extract media from document (individual files)
async function example6() {
    console.log("\nExample 6: Extract media files")

    // Create a simple HTML document with embedded base64 image
    const html = `<!DOCTYPE html>
<html>
<body>
<h1>Document with Embedded Image</h1>
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" alt="Red pixel">
</body>
</html>`

    const options = {
        from: "html",
        to: "markdown",
        "extract-media": "media" // Extract to media/ directory
    }

    const files = {}
    const result = await convert(options, html, files)

    console.log("Markdown output:\n", result.stdout)

    // List all extracted media files (result.mediaFiles contains only newly created files)
    const extractedFiles = Object.keys(result.mediaFiles)
    if (extractedFiles.length > 0) {
        console.log("Extracted media files:", extractedFiles)
        for (const filename of extractedFiles) {
            console.log(
                `  - ${filename}: ${result.mediaFiles[filename].size} bytes`
            )
        }
    } else {
        console.log(
            "No media files were extracted (image may have been skipped or kept as data URI)"
        )
    }
}

// Example 7: Media extraction comparison - new vs legacy API
async function example7() {
    console.log("\nExample 7: Media extraction - API comparison")

    const markdown = `# Document with Image Reference

![Test Image](image.png)

This demonstrates how the new API handles media files.
`

    // Create a simple PNG (1x1 red pixel)
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

    // Using the new convert() API
    const options = {
        from: "markdown",
        to: "html"
    }

    const files = {
        "image.png": new Blob([pngData], {type: "image/png"})
    }

    const result = await convert(options, markdown, files)

    console.log("New API (convert):")
    console.log(
        "  - Returns files as dictionary:",
        typeof result.files === "object"
    )
    console.log("  - Input files preserved:", "image.png" in result.files)
    console.log(
        "  - All files accessible:",
        Object.keys(result.files).join(", ")
    )
    console.log(
        "  - Separate mediaFiles for new files:",
        Object.keys(result.mediaFiles).length,
        "new files"
    )
    console.log("  - Easy to iterate without filtering!")

    // Compare with legacy API behavior (shown conceptually)
    console.log("\nLegacy API (pandoc):")
    console.log("  - Returns mediaFiles as Map")
    console.log("  - More complex to extract and use media")
    console.log("  - Required scanning filesystem manually")

    console.log("\n✓ The new API makes media file handling much easier!")
    console.log(
        "✓ result.mediaFiles contains only newly created files - no filtering needed!"
    )
}

// Example 8: String values for text files (convenience)
async function example8() {
    console.log(
        "\nExample 8: Text files as strings (no Blob conversion needed)"
    )

    // Text files can be provided as strings - much more convenient!
    const bibContent = `@article{smith2020,
  author = {Smith, John},
  title = {Important Research},
  journal = {Science Journal},
  year = {2020}
}

@article{jones2021,
  author = {Jones, Jane},
  title = {More Research},
  journal = {Nature},
  year = {2021}
}`

    const cssContent = `body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}`

    const markdown = `# Research Paper

According to recent studies [@smith2020; @jones2021], this is important.

## Methodology

Our research methodology...

# References
`

    const options = {
        from: "markdown",
        to: "html",
        standalone: true,
        citeproc: true,
        bibliography: "references.bib",
        css: "style.css"
    }

    // Mix of string (text) and Blob (binary) files
    const pngData = new Uint8Array([
        137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0,
        1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 144, 119, 83, 222, 0, 0, 0, 12, 73, 68,
        65, 84, 8, 215, 99, 248, 207, 192, 0, 0, 3, 1, 1, 0, 24, 221, 141, 176,
        0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130
    ])

    const files = {
        "references.bib": bibContent, // String - text file!
        "style.css": cssContent, // String - text file!
        "logo.png": new Blob([pngData]) // Blob - binary file
    }

    const result = await convert(options, markdown, files)

    console.log("Files provided:")
    console.log(
        "  - references.bib (string):",
        typeof files["references.bib"] === "string" ? "✓" : "✗"
    )
    console.log(
        "  - style.css (string):",
        typeof files["style.css"] === "string" ? "✓" : "✗"
    )
    console.log(
        "  - logo.png (Blob):",
        files["logo.png"] instanceof Blob ? "✓" : "✗"
    )

    console.log("\nConversion successful:")
    console.log("  - HTML output length:", result.stdout.length, "chars")
    console.log(
        "  - Includes citations:",
        result.stdout.includes("Smith") && result.stdout.includes("Jones")
            ? "✓"
            : "✗"
    )
    console.log("  - Warnings:", result.warnings.length)

    console.log("\n✓ Text files can be strings - no need to convert to Blobs!")
    console.log("✓ Binary files still use Blobs")
    console.log(
        "✓ Much more convenient for bibliographies, CSS, metadata files, etc."
    )
}

// Run all examples
async function runAllExamples() {
    try {
        await example1()
        await example2()
        await example3()
        await example4()
        await example5()
        await example6()
        await example7()
        await example8()
        console.log("\n✓ All examples completed successfully!")
    } catch (error) {
        console.error("Error running examples:", error)
    }
}

// Run examples if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples()
}

export {
    example1,
    example2,
    example3,
    example4,
    example5,
    example6,
    example7,
    example8,
    runAllExamples
}
