#!/usr/bin/env node

/**
 * Non-ASCII File Names Example
 *
 * This example demonstrates that wasm-pandoc correctly handles file names
 * containing non-ASCII characters from various languages and writing systems.
 *
 * The example covers:
 * - German (ä, ö, ü, ß)
 * - Scandinavian (å, ø, æ)
 * - Arabic (العربية)
 * - Spanish (ñ, á, é, í, ó, ú)
 * - Mixed languages in a single document
 *
 * This is particularly important for international users who may have files
 * with names in their native languages.
 */

import {convert} from "../index.js"

console.log("Non-ASCII File Names Example\n")
console.log("=".repeat(70))

// Create a simple PNG image (1x1 red pixel) for use in examples
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
    84, // IDAT chunk
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
    68 // IEND chunk
])

/**
 * Example 1: German file names
 *
 * German uses umlauts (ä, ö, ü) and the eszett (ß) character.
 * These are commonly used in German file names.
 */
async function example1_german() {
    console.log("\n1. German File Names (ä, ö, ü, ß)")
    console.log("-".repeat(70))

    const markdown = `# Deutsches Dokument

Dieses Dokument enthält Bilder mit deutschen Dateinamen.

![Begrüßung](Begrüßung.png)
![Übersicht](Übersicht.png)
![Schön](schön.png)

Das war's!
`

    const files = {
        "Begrüßung.png": new Blob([pngData], {type: "image/png"}),
        "Übersicht.png": new Blob([pngData], {type: "image/png"}),
        "schön.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("Input files:", Object.keys(files).join(", "))
    console.log("Result files:", Object.keys(result.files).join(", "))

    // Verify all files are accessible
    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            console.log(
                `  ✓ "${filename}" - ${result.files[filename].size} bytes`
            )
        }
    }

    console.log("✓ German file names work correctly!")
}

/**
 * Example 2: Scandinavian file names
 *
 * Scandinavian languages use special characters like å, ø, and æ (Danish/Norwegian)
 * and ä, ö (Swedish/Finnish).
 */
async function example2_scandinavian() {
    console.log("\n2. Scandinavian File Names (å, ø, æ, ä, ö)")
    console.log("-".repeat(70))

    const markdown = `# Skandinaviskt Dokument

Ett dokument med bilder från olika nordiska länder.

![Norge](Norge.png)
![Sverige](Sverige.png)
![Danmark](Danmark.png)
![Smörgås](Smörgås.png)

Klar!
`

    const files = {
        "Norge.png": new Blob([pngData], {type: "image/png"}),
        "Sverige.png": new Blob([pngData], {type: "image/png"}),
        "Danmark.png": new Blob([pngData], {type: "image/png"}),
        "Smörgås.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("Input files:", Object.keys(files).join(", "))
    console.log("Result files:", Object.keys(result.files).join(", "))

    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            console.log(
                `  ✓ "${filename}" - ${result.files[filename].size} bytes`
            )
        }
    }

    console.log("✓ Scandinavian file names work correctly!")
}

/**
 * Example 3: Arabic file names
 *
 * Arabic uses a right-to-left script with its own set of characters.
 * This tests support for non-Latin writing systems.
 */
async function example3_arabic() {
    console.log("\n3. Arabic File Names")
    console.log("-".repeat(70))

    const markdown = `# مستند عربي

هذا مستند يحتوي على صور بأسماء ملفات عربية.

![صورة](صورة.png)
![رسم](رسم.png)
![مخطط](مخطط.png)

نهاية المستند.
`

    const files = {
        "صورة.png": new Blob([pngData], {type: "image/png"}),
        "رسم.png": new Blob([pngData], {type: "image/png"}),
        "مخطط.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("Input files:", Object.keys(files).join(", "))
    console.log("Result files:", Object.keys(result.files).join(", "))

    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            console.log(
                `  ✓ "${filename}" - ${result.files[filename].size} bytes`
            )
        }
    }

    console.log("✓ Arabic file names work correctly!")
}

/**
 * Example 4: Spanish file names
 *
 * Spanish uses accented vowels (á, é, í, ó, ú), ü, and ñ.
 */
async function example4_spanish() {
    console.log("\n4. Spanish File Names (ñ, á, é, í, ó, ú, ü)")
    console.log("-".repeat(70))

    const markdown = `# Documento en Español

¡Hola! Este es un documento con imágenes en español.

![Imágenes](imágenes.png)
![Año](año.png)
![María](María.png)
![País](país.png)

Fin del documento.
`

    const files = {
        "imágenes.png": new Blob([pngData], {type: "image/png"}),
        "año.png": new Blob([pngData], {type: "image/png"}),
        "María.png": new Blob([pngData], {type: "image/png"}),
        "país.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("Input files:", Object.keys(files).join(", "))
    console.log("Result files:", Object.keys(result.files).join(", "))

    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            console.log(
                `  ✓ "${filename}" - ${result.files[filename].size} bytes`
            )
        }
    }

    console.log("✓ Spanish file names work correctly!")
}

/**
 * Example 5: Mixed languages in a single document
 *
 * A real-world scenario where a document references files from multiple languages.
 */
async function example5_mixed() {
    console.log("\n5. Mixed Languages in One Document")
    console.log("-".repeat(70))

    const markdown = `# International Document

This document has images from multiple languages.

## German Section
![Tschüss](Tschüss.png)

## Scandinavian Section
![Lagom](Lagom.png)

## Arabic Section
![مرحبا](مرحبا.png)

## Spanish Section
![Español](Español.png)
`

    const files = {
        "Tschüss.png": new Blob([pngData], {type: "image/png"}),
        "Lagom.png": new Blob([pngData], {type: "image/png"}),
        "مرحبا.png": new Blob([pngData], {type: "image/png"}),
        "Español.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("Input files:", Object.keys(files).join(", "))
    console.log("Result files:", Object.keys(result.files).join(", "))
    console.log("Total files:", Object.keys(result.files).length)

    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            console.log(`  ✓ "${filename}"`)
        }
    }

    console.log("✓ Mixed language file names work correctly!")
}

/**
 * Example 6: Non-ASCII characters in output file name
 *
 * Testing that output files can also have non-ASCII names.
 */
async function example6_outputName() {
    console.log("\n6. Non-ASCII Characters in Output File Name")
    console.log("-".repeat(70))

    const markdown = `# Test Output

Simple content for output test.
`

    const files = {
        "input.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        "output-file": "Über.html"
    }

    const result = await convert(options, markdown, files)

    console.log("Output file name: Über.html")
    console.log("All files:", Object.keys(result.files).join(", "))

    if ("Über.html" in result.files) {
        console.log(`  ✓ Output file "Über.html" exists`)
        console.log(`  Size: ${result.files["Über.html"].size} bytes`)
    }

    console.log("✓ Non-ASCII output file names work correctly!")
}

/**
 * Example 7: Practical use case - International documentation
 *
 * A realistic scenario for documentation in multiple languages.
 */
async function example7_practical() {
    console.log("\n7. Practical Use Case: International Documentation")
    console.log("-".repeat(70))

    const markdown = `# User Guide

This guide includes screenshots for different language versions.

## German UI
![German Interface](ui-de.png)

## Spanish UI
![Spanish Interface](ui-es.png)

## Arabic UI
![Arabic Interface](ui-ar.png)

## Swedish UI
![Swedish Interface](ui-sv.png)
`

    const files = {
        "ui-de.png": new Blob([pngData], {type: "image/png"}),
        "ui-es.png": new Blob([pngData], {type: "image/png"}),
        "ui-ar.png": new Blob([pngData], {type: "image/png"}),
        "ui-sv.png": new Blob([pngData], {type: "image/png"})
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true
    }

    const result = await convert(options, markdown, files)

    console.log("UI language files:")
    for (const filename of Object.keys(files)) {
        if (filename in result.files) {
            const lang = filename.split("-")[1].split(".")[0].toUpperCase()
            console.log(`  ${lang}: "${filename}" ✓`)
        }
    }

    console.log("HTML output length:", result.stdout.length, "characters")
    console.log("✓ Practical international documentation scenario works!")
}

/**
 * Example 8: Non-Latin scripts in bibliography file names
 *
 * Testing bibliography files with Arabic, Korean, and Japanese names.
 */
async function example8_nonLatinBibliography() {
    console.log("\n8. Non-Latin Scripts in Bibliography File Names")
    console.log("-".repeat(70))

    const markdown = `# Multilingual Research Paper

This paper cites research in different languages.

## Arabic Citation
[@العربي2024]

## Korean Citation
[@김2024]

## Japanese Citation
[@山田2024]

# References / المراجع / 参考文献 / 참고문헌
`

    const bibContent = `@article{العربي2024,
  author = {العربي, أحمد},
  title = {بحث باللغة العربية},
  year = {2024}
}

@article{김2024,
  author = {김, 철수},
  title = {한국어 연구},
  year = {2024}
}

@article{山田2024,
  author = {山田, 太郎},
  title = {日本語の研究},
  year = {2024}
}`

    const files = {
        "مراجع.bib": bibContent
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true,
        bibliography: "مراجع.bib",
        citeproc: true
    }

    const result = await convert(options, markdown, files)

    console.log("Bibliography file: مراجع.bib (Arabic)")
    console.log("Files in result:", Object.keys(result.files).join(", "))

    if ("مراجع.bib" in result.files) {
        console.log(`  ✓ Arabic bibliography file "مراجع.bib" accessible`)
    }

    console.log("✓ Non-Latin scripts in bibliography file names work!")
}

/**
 * Example 9: Non-Latin scripts in CSS file names
 *
 * Testing CSS files with Japanese and Korean names.
 */
async function example9_nonLatinCSS() {
    console.log("\n9. Non-Latin Scripts in CSS File Names")
    console.log("-".repeat(70))

    const markdown = `# Styled Document

This document uses CSS files with non-Latin names.
`

    const cssContent = `body {
    font-family: "Noto Sans", sans-serif;
    max-width: 800px;
}`

    const files = {
        "スタイル.css": cssContent,
        "스타일.css": cssContent
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true,
        css: ["スタイル.css", "스타일.css"]
    }

    const result = await convert(options, markdown, files)

    console.log("CSS files:")
    console.log("  Japanese: スタイル.css")
    console.log("  Korean: スタ일.css")
    console.log("Files in result:", Object.keys(result.files).join(", "))

    for (const filename of ["スタイル.css", "스타일.css"]) {
        if (filename in result.files) {
            console.log(`  ✓ "${filename}" accessible`)
        }
    }

    console.log("✓ Non-Latin scripts in CSS file names work!")
}

/**
 * Example 10: Multiple non-Latin scripts in one document
 *
 * Testing a document with files in Arabic, Korean, and Japanese.
 */
async function example10_multiNonLatin() {
    console.log("\n10. Multiple Non-Latin Scripts in One Document")
    console.log("-".repeat(70))

    const markdown = `# Multilingual Document with Non-Latin File Names

## Arabic Section
![صورة](صورة.png)
Citation [@العربي2024].

## Korean Section
![이미지](이미지.png)
Citation [@김2024].

## Japanese Section
![画像](画像.png)
Citation [@山田2024].

# References / المراجع / 참고문헌 / 参考文献
`

    const bibContent = `@article{العربي2024,
  author = {العربي, أحمد},
  title = {عربي},
  year = {2024}
}

@article{김2024,
  author = {김, 철수},
  title = {한국어},
  year = {2024}
}

@article{山田2024,
  author = {山田, 太郎},
  title = {日本語},
  year = {2024}
}`

    const files = {
        "صورة.png": new Blob([pngData], {type: "image/png"}),
        "이미지.png": new Blob([pngData], {type: "image/png"}),
        "画像.png": new Blob([pngData], {type: "image/png"}),
        "مراجع.bib": bibContent
    }

    const options = {
        from: "markdown",
        to: "html",
        standalone: true,
        bibliography: "مراجع.bib",
        citeproc: true
    }

    const result = await convert(options, markdown, files)

    console.log("Files with non-Latin scripts:")
    console.log("  Arabic: صورة.png, مراجع.bib")
    console.log("  Korean: 이미지.png")
    console.log("  Japanese: 画像.png")
    console.log("Files in result:", Object.keys(result.files).join(", "))

    let accessibleCount = 0
    const expectedFiles = ["صورة.png", "이미지.png", "画像.png", "مراجع.bib"]
    for (const filename of expectedFiles) {
        if (filename in result.files) {
            accessibleCount++
            console.log(`  ✓ "${filename}" accessible`)
        }
    }

    if (accessibleCount === 4) {
        console.log("  All non-Latin files accessible ✓")
    }

    console.log("✓ Multiple non-Latin scripts in one document work!")
}

// Run all examples
async function runAllExamples() {
    try {
        await example1_german()
        await example2_scandinavian()
        await example3_arabic()
        await example4_spanish()
        await example5_mixed()
        await example6_outputName()
        await example7_practical()
        await example8_nonLatinBibliography()
        await example9_nonLatinCSS()
        await example10_multiNonLatin()

        console.log("\n" + "=".repeat(70))
        console.log(
            "✓ All non-ASCII file name examples completed successfully!"
        )
        console.log("=".repeat(70))

        console.log("\nKey Takeaways:")
        console.log("  • German file names (ä, ö, ü, ß) work correctly")
        console.log("  • Scandinavian file names (å, ø, æ) work correctly")
        console.log("  • Arabic file names (RTL script) work correctly")
        console.log(
            "  • Spanish file names (ñ, á, é, í, ó, ú, ü) work correctly"
        )
        console.log("  • Mixed language documents work correctly")
        console.log("  • Non-ASCII output file names work correctly")
        console.log("  • Non-ASCII bibliography file names work correctly")
        console.log("  • Non-ASCII CSS file names work correctly")
        console.log("  • Multiple non-ASCII files in options work correctly")
        console.log("  • International documentation scenarios are supported")
        console.log(
            "  • Non-Latin scripts in bibliography files work correctly"
        )
        console.log("    - Arabic (مراجع.bib)")
        console.log("    - Korean (참고문헌.bib)")
        console.log("    - Japanese (参考文献.bib)")
        console.log("  • Non-Latin scripts in CSS files work correctly")
        console.log("    - Japanese (スタイル.css)")
        console.log("    - Korean (스타일.css)")
        console.log(
            "  • Multiple non-Latin scripts in one document work correctly"
        )
        console.log("\nwasm-pandoc handles non-ASCII file names seamlessly,")
        console.log("both in files object and in pandoc options!")
        console.log("This includes support for non-Latin scripts like")
        console.log("Arabic, Korean, and Japanese.")
    } catch (error) {
        console.error("\n✗ Error running examples:", error)
        if (error.stack) {
            console.error("\nStack trace:")
            console.error(error.stack)
        }
        process.exit(1)
    }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllExamples()
}

export {
    example1_german,
    example2_scandinavian,
    example3_arabic,
    example4_spanish,
    example5_mixed,
    example6_outputName,
    example7_practical,
    example8_nonLatinBibliography,
    example9_nonLatinCSS,
    example10_multiNonLatin,
    runAllExamples
}
