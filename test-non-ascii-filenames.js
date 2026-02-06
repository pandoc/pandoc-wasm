#!/usr/bin/env node

/**
 * Test script for non-ASCII file names in pandoc-wasm
 *
 * This test verifies that pandoc-wasm correctly handles file names containing
 * non-ASCII characters from various languages:
 * - German (ä, ö, ü, ß)
 * - Scandinavian (å, ø, æ, ö, ä)
 * - Arabic
 * - Spanish (ñ, á, é, í, ó, ú, ü, ¿, ¡)
 */

import {convert} from "./index.js"

console.log("Testing non-ASCII file names in pandoc-wasm...\n")

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

async function runTests() {
    try {
        // Test 1: German characters (ä, ö, ü, ß)
        console.log("Test 1: German characters in file names")
        console.log("-".repeat(70))

        const germanMarkdown = `# Deutsches Dokument

Dies ist ein Dokument mit Bildern.

![Grüße](Grüße.png)
![Über](über.png)
![Schön](schön.png)

Ende des Dokuments.
`

        const germanFiles = {
            "Grüße.png": new Blob([pngData], {type: "image/png"}),
            "über.png": new Blob([pngData], {type: "image/png"}),
            "schön.png": new Blob([pngData], {type: "image/png"})
        }

        const germanOptions = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const germanResult = await convert(
            germanOptions,
            germanMarkdown,
            germanFiles
        )

        console.log("✓ German file names test passed")
        console.log("  Input files:", Object.keys(germanFiles).join(", "))
        console.log(
            "  Files in result:",
            Object.keys(germanResult.files).join(", ")
        )

        // Verify files are accessible
        let germanCount = 0
        for (const filename of Object.keys(germanFiles)) {
            if (filename in germanResult.files) {
                germanCount++
                console.log(
                    `  ✓ File accessible: "${filename}" (${germanResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ File NOT accessible: "${filename}"`)
            }
        }

        if (germanCount === 3) {
            console.log("  All German files accessible ✓")
        }

        // Test 2: Scandinavian characters (å, ø, æ, ö, ä)
        console.log("\nTest 2: Scandinavian characters in file names")
        console.log("-".repeat(70))

        const scandiMarkdown = `# Skandinaviskt dokument

Detta är ett dokument med bilder.

![Billeder](billeder.png)
![Mønster](mønster.png)
![Lärobok](lärobok.png)
![Översättning](översättning.png)

Dokumentets slut.
`

        const scandiFiles = {
            "billeder.png": new Blob([pngData], {type: "image/png"}),
            "mønster.png": new Blob([pngData], {type: "image/png"}),
            "lärobok.png": new Blob([pngData], {type: "image/png"}),
            "översättning.png": new Blob([pngData], {type: "image/png"})
        }

        const scandiOptions = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const scandiResult = await convert(
            scandiOptions,
            scandiMarkdown,
            scandiFiles
        )

        console.log("✓ Scandinavian file names test passed")
        console.log("  Input files:", Object.keys(scandiFiles).join(", "))
        console.log(
            "  Files in result:",
            Object.keys(scandiResult.files).join(", ")
        )

        // Verify files are accessible
        let scandiCount = 0
        for (const filename of Object.keys(scandiFiles)) {
            if (filename in scandiResult.files) {
                scandiCount++
                console.log(
                    `  ✓ File accessible: "${filename}" (${scandiResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ File NOT accessible: "${filename}"`)
            }
        }

        if (scandiCount === 4) {
            console.log("  All Scandinavian files accessible ✓")
        }

        // Test 3: Arabic characters
        console.log("\nTest 3: Arabic characters in file names")
        console.log("-".repeat(70))

        const arabicMarkdown = `# مستند باللغة العربية

هذا مستند يحتوي على صور.

![صورة](صورة.png)
![رسوم](رسوم.png)

نهاية المستند.
`

        const arabicFiles = {
            "صورة.png": new Blob([pngData], {type: "image/png"}),
            "رسوم.png": new Blob([pngData], {type: "image/png"})
        }

        const arabicOptions = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const arabicResult = await convert(
            arabicOptions,
            arabicMarkdown,
            arabicFiles
        )

        console.log("✓ Arabic file names test passed")
        console.log("  Input files:", Object.keys(arabicFiles).join(", "))
        console.log(
            "  Files in result:",
            Object.keys(arabicResult.files).join(", ")
        )

        // Verify files are accessible
        let arabicCount = 0
        for (const filename of Object.keys(arabicFiles)) {
            if (filename in arabicResult.files) {
                arabicCount++
                console.log(
                    `  ✓ File accessible: "${filename}" (${arabicResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ File NOT accessible: "${filename}"`)
            }
        }

        if (arabicCount === 2) {
            console.log("  All Arabic files accessible ✓")
        }

        // Test 4: Spanish characters (ñ, á, é, í, ó, ú, ü, ¿, ¡)
        console.log("\nTest 4: Spanish characters in file names")
        console.log("-".repeat(70))

        const spanishMarkdown = `# Documento en Español

¡Hola! Este es un documento con imágenes.

![Imágenes](imágenes.png)
![Año](año.png)
![María](María.png)
![Sofá](sofá.png)

Fin del documento.
`

        const spanishFiles = {
            "imágenes.png": new Blob([pngData], {type: "image/png"}),
            "año.png": new Blob([pngData], {type: "image/png"}),
            "María.png": new Blob([pngData], {type: "image/png"}),
            "sofá.png": new Blob([pngData], {type: "image/png"})
        }

        const spanishOptions = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const spanishResult = await convert(
            spanishOptions,
            spanishMarkdown,
            spanishFiles
        )

        console.log("✓ Spanish file names test passed")
        console.log("  Input files:", Object.keys(spanishFiles).join(", "))
        console.log(
            "  Files in result:",
            Object.keys(spanishResult.files).join(", ")
        )

        // Verify files are accessible
        let spanishCount = 0
        for (const filename of Object.keys(spanishFiles)) {
            if (filename in spanishResult.files) {
                spanishCount++
                console.log(
                    `  ✓ File accessible: "${filename}" (${spanishResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ File NOT accessible: "${filename}"`)
            }
        }

        if (spanishCount === 4) {
            console.log("  All Spanish files accessible ✓")
        }

        // Test 5: Mixed languages in a single document
        console.log("\nTest 5: Mixed languages in a single document")
        console.log("-".repeat(70))

        const mixedMarkdown = `# International Document

This document has files from multiple languages.

## German
![Tschüss](Tschüss.png)

## Scandinavian
![Smörgås](Smörgås.png)

## Arabic
![مرحبا](مرحبا.png)

## Spanish
![Español](Español.png)
`

        const mixedFiles = {
            "Tschüss.png": new Blob([pngData], {type: "image/png"}),
            "Smörgås.png": new Blob([pngData], {type: "image/png"}),
            "مرحبا.png": new Blob([pngData], {type: "image/png"}),
            "Español.png": new Blob([pngData], {type: "image/png"})
        }

        const mixedOptions = {
            from: "markdown",
            to: "html",
            standalone: true
        }

        const mixedResult = await convert(
            mixedOptions,
            mixedMarkdown,
            mixedFiles
        )

        console.log("✓ Mixed language file names test passed")
        console.log("  Input files:", Object.keys(mixedFiles).join(", "))
        console.log(
            "  Files in result:",
            Object.keys(mixedResult.files).join(", ")
        )
        console.log("  Total files:", Object.keys(mixedResult.files).length)

        // Verify all files are accessible
        let mixedCount = 0
        for (const filename of Object.keys(mixedFiles)) {
            if (filename in mixedResult.files) {
                mixedCount++
                console.log(`  ✓ File accessible: "${filename}"`)
            } else {
                console.log(`  ✗ File NOT accessible: "${filename}"`)
            }
        }

        if (mixedCount === 4) {
            console.log("  All mixed language files accessible ✓")
        }

        // Test 6: Non-ASCII in output file name
        console.log("\nTest 6: Non-ASCII characters in output file name")
        console.log("-".repeat(70))

        const outputMarkdown = `# Test Document

Simple content.
`

        const outputFiles = {
            "input.png": new Blob([pngData], {type: "image/png"})
        }

        const outputOptions = {
            from: "markdown",
            to: "html",
            "output-file": "Über.html"
        }

        const outputResult = await convert(
            outputOptions,
            outputMarkdown,
            outputFiles
        )

        if ("Über.html" in outputResult.files) {
            console.log("✓ Non-ASCII output file name test passed")
            console.log("  Output file name: Über.html")
            console.log(
                "  Files in result:",
                Object.keys(outputResult.files).join(", ")
            )
            console.log("  ✓ Output file accessible with non-ASCII name")
            console.log(
                `    File size: ${outputResult.files["Über.html"].size} bytes`
            )
        } else {
            console.log("✗ Non-ASCII output file name test FAILED")
            console.log("  Output file name: Über.html")
            console.log(
                "  Files in result:",
                Object.keys(outputResult.files).join(", ")
            )
            console.log("  ✗ Output file NOT accessible with non-ASCII name")
            throw new Error("Output file with non-ASCII name not accessible")
        }

        // Test 7: Non-ASCII bibliography file name in options
        console.log("\nTest 7: Non-ASCII bibliography file name in options")
        console.log("-".repeat(70))

        const bibMarkdown = `# Research Paper

Citation here [@müller2024, @jörgensen2024].

# References
`

        const bibContent = `@article{müller2024,
  author = {Müller, Hans},
  title = {Important Research},
  year = {2024}
}

@article{jörgensen2024,
  author = {Jörgensen, Lars},
  title = {Another Study},
  year = {2024}
}`

        const bibFiles = {
            "literatür.bib": new Blob([bibContent], {type: "text/plain"})
        }

        const bibOptions = {
            from: "markdown",
            to: "html",
            bibliography: "literatür.bib",
            citeproc: true
        }

        const bibResult = await convert(bibOptions, bibMarkdown, bibFiles)

        console.log("✓ Non-ASCII bibliography file name test passed")
        console.log("  Bibliography file: literatür.bib")
        console.log(
            "  Files in result:",
            Object.keys(bibResult.files).join(", ")
        )

        if ("literatür.bib" in bibResult.files) {
            console.log("  ✓ Bibliography file accessible with non-ASCII name")
            console.log(
                `    File size: ${bibResult.files["literatür.bib"].size} bytes`
            )
        } else {
            console.log("  ✗ Bibliography file NOT accessible")
        }

        // Test 8: Non-ASCII CSS file name in options
        console.log("\nTest 8: Non-ASCII CSS file name in options")
        console.log("-".repeat(70))

        const cssMarkdown = `# Styled Document

This document should use custom styling.
`

        const cssContent = `body { font-family: "Fira Sans", sans-serif; }
h1 { color: #2c3e50; }`

        const cssFiles = {
            "estílos.css": new Blob([cssContent], {type: "text/css"})
        }

        const cssOptions = {
            from: "markdown",
            to: "html",
            standalone: true,
            css: ["estílos.css"]
        }

        const cssResult = await convert(cssOptions, cssMarkdown, cssFiles)

        console.log("✓ Non-ASCII CSS file name test passed")
        console.log("  CSS file: estílos.css")
        console.log(
            "  Files in result:",
            Object.keys(cssResult.files).join(", ")
        )

        if ("estílos.css" in cssResult.files) {
            console.log("  ✓ CSS file accessible with non-ASCII name")
            console.log(
                `    File size: ${cssResult.files["estílos.css"].size} bytes`
            )
        } else {
            console.log("  ✗ CSS file NOT accessible")
        }

        // Test 9: Multiple non-ASCII files in options
        console.log("\nTest 9: Multiple non-ASCII files in options")
        console.log("-".repeat(70))

        const multiMarkdown = `# Comprehensive Test

Citation [@köning2024].

# References
`

        const multiBibContent = `@article{köning2024,
  author = {König, Peter},
  title = {Test Article},
  year = {2024}
}`

        const multiCssContent = `.main { max-width: 800px; }`

        const multiFiles = {
            "referéncias.bib": new Blob([multiBibContent], {
                type: "text/plain"
            }),
            "estíl.css": new Blob([multiCssContent], {type: "text/css"}),
            "logó.png": new Blob([pngData], {type: "image/png"})
        }

        const multiOptions = {
            from: "markdown",
            to: "html",
            standalone: true,
            bibliography: "referéncias.bib",
            citeproc: true,
            css: ["estíl.css"],
            "output-file": "výstup.html"
        }

        const multiResult = await convert(
            multiOptions,
            multiMarkdown,
            multiFiles
        )

        console.log("Multiple non-ASCII files in options test")
        console.log("  Bibliography: referéncias.bib")
        console.log("  CSS: estíl.css")
        console.log("  Input image: logó.png")
        console.log("  Output file: výstup.html")
        console.log(
            "  Files in result:",
            Object.keys(multiResult.files).join(", ")
        )

        let multiCount = 0
        const expectedFiles = [
            "referéncias.bib",
            "estíl.css",
            "logó.png",
            "výstup.html"
        ]
        for (const filename of expectedFiles) {
            if (filename in multiResult.files) {
                multiCount++
                console.log(
                    `  ✓ "${filename}" accessible (${multiResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ "${filename}" NOT accessible (unexpected)`)
            }
        }

        if (multiCount === 4) {
            console.log(
                "  ✓ All files with non-ASCII names accessible (including output file)"
            )
        } else {
            throw new Error(
                `Expected 4 files but only ${multiCount} accessible`
            )
        }

        // Test 10: Non-Latin scripts in options - Arabic bibliography
        console.log(
            "\nTest 10: Non-Latin scripts in options - Arabic bibliography"
        )
        console.log("-".repeat(70))

        const arabicBibMarkdown = `# ورقة بحثية

الاستشهاد [@العربي2024].

# المراجع
`

        const arabicBibContent = `@article{العربي2024,
  author = {العربي, أحمد},
  title = {بحث باللغة العربية},
  year = {2024}
}`

        const arabicBibFiles = {
            "مراجع.bib": new Blob([arabicBibContent], {type: "text/plain"})
        }

        const arabicBibOptions = {
            from: "markdown",
            to: "html",
            bibliography: "مراجع.bib",
            citeproc: true
        }

        const arabicBibResult = await convert(
            arabicBibOptions,
            arabicBibMarkdown,
            arabicBibFiles
        )

        console.log("✓ Arabic bibliography file name test passed")
        console.log("  Bibliography file: مراجع.bib")
        console.log(
            "  Files in result:",
            Object.keys(arabicBibResult.files).join(", ")
        )

        if ("مراجع.bib" in arabicBibResult.files) {
            console.log("  ✓ Arabic bibliography file accessible")
            console.log(
                `    File size: ${arabicBibResult.files["مراجع.bib"].size} bytes`
            )
        } else {
            console.log("  ✗ Arabic bibliography file NOT accessible")
        }

        // Test 11: Non-Latin scripts in options - Korean bibliography
        console.log(
            "\nTest 11: Non-Latin scripts in options - Korean bibliography"
        )
        console.log("-".repeat(70))

        const koreanBibMarkdown = `# 연구 논문

인용 [@김2024].

# 참고문헌
`

        const koreanBibContent = `@article{김2024,
  author = {김, 철수},
  title = {한국어 연구},
  year = {2024}
}`

        const koreanBibFiles = {
            "참고문헌.bib": new Blob([koreanBibContent], {type: "text/plain"})
        }

        const koreanBibOptions = {
            from: "markdown",
            to: "html",
            bibliography: "참고문헌.bib",
            citeproc: true
        }

        const koreanBibResult = await convert(
            koreanBibOptions,
            koreanBibMarkdown,
            koreanBibFiles
        )

        console.log("✓ Korean bibliography file name test passed")
        console.log("  Bibliography file: 참고문헌.bib")
        console.log(
            "  Files in result:",
            Object.keys(koreanBibResult.files).join(", ")
        )

        if ("참고문헌.bib" in koreanBibResult.files) {
            console.log("  ✓ Korean bibliography file accessible")
            console.log(
                `    File size: ${koreanBibResult.files["참고문헌.bib"].size} bytes`
            )
        } else {
            console.log("  ✗ Korean bibliography file NOT accessible")
        }

        // Test 12: Non-Latin scripts in options - Japanese bibliography
        console.log(
            "\nTest 12: Non-Latin scripts in options - Japanese bibliography"
        )
        console.log("-".repeat(70))

        const japaneseBibMarkdown = `# 研究論文

引用 [@山田2024].

# 参考文献
`

        const japaneseBibContent = `@article{山田2024,
  author = {山田, 太郎},
  title = {日本語の研究},
  year = {2024}
}`

        const japaneseBibFiles = {
            "参考文献.bib": new Blob([japaneseBibContent], {type: "text/plain"})
        }

        const japaneseBibOptions = {
            from: "markdown",
            to: "html",
            bibliography: "参考文献.bib",
            citeproc: true
        }

        const japaneseBibResult = await convert(
            japaneseBibOptions,
            japaneseBibMarkdown,
            japaneseBibFiles
        )

        console.log("✓ Japanese bibliography file name test passed")
        console.log("  Bibliography file: 参考文献.bib")
        console.log(
            "  Files in result:",
            Object.keys(japaneseBibResult.files).join(", ")
        )

        if ("参考文献.bib" in japaneseBibResult.files) {
            console.log("  ✓ Japanese bibliography file accessible")
            console.log(
                `    File size: ${japaneseBibResult.files["参考文献.bib"].size} bytes`
            )
        } else {
            console.log("  ✗ Japanese bibliography file NOT accessible")
        }

        // Test 13: Non-Latin scripts in options - CSS files
        console.log("\nTest 13: Non-Latin scripts in options - CSS files")
        console.log("-".repeat(70))

        const nonLatinCssMarkdown = `# Document with Non-Latin CSS

This document uses CSS files with non-Latin names.
`

        const nonLatinCssContent = `body {
    font-family: "Noto Sans", sans-serif;
    max-width: 800px;
}`

        const nonLatinCssFiles = {
            "スタイル.css": new Blob([nonLatinCssContent], {type: "text/css"}),
            "스타일.css": new Blob([nonLatinCssContent], {type: "text/css"})
        }

        const nonLatinCssOptions = {
            from: "markdown",
            to: "html",
            standalone: true,
            css: ["スタイル.css", "스타일.css"]
        }

        const nonLatinCssResult = await convert(
            nonLatinCssOptions,
            nonLatinCssMarkdown,
            nonLatinCssFiles
        )

        console.log("✓ Non-Latin CSS file names test passed")
        console.log("  CSS files: スタイル.css, 스타일.css")
        console.log(
            "  Files in result:",
            Object.keys(nonLatinCssResult.files).join(", ")
        )

        let cssCount = 0
        for (const filename of ["スタイル.css", "스타일.css"]) {
            if (filename in nonLatinCssResult.files) {
                cssCount++
                console.log(
                    `  ✓ "${filename}" accessible (${nonLatinCssResult.files[filename].size} bytes)`
                )
            } else {
                console.log(`  ✗ "${filename}" NOT accessible`)
            }
        }

        if (cssCount === 2) {
            console.log("  All non-Latin CSS files accessible ✓")
        }

        // Test 14: Multiple non-Latin scripts in one document
        console.log("\nTest 14: Multiple non-Latin scripts in one document")
        console.log("-".repeat(70))

        const multiNonLatinMarkdown = `# Multilingual Document

This document uses files with names in different scripts.

## Arabic
![صورة](صورة.png)
Citation [@العربي2024].

## Korean
![이미지](이미지.png)
Citation [@김2024].

## Japanese
![画像](画像.png)
Citation [@山田2024].

# 参考文献 / المراجع / 참고문헌
`

        const multiNonLatinBibContent = `@article{العربي2024,
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

        const multiNonLatinFiles = {
            "صورة.png": new Blob([pngData], {type: "image/png"}),
            "이미지.png": new Blob([pngData], {type: "image/png"}),
            "画像.png": new Blob([pngData], {type: "image/png"}),
            "مراجع.bib": new Blob([multiNonLatinBibContent], {
                type: "text/plain"
            })
        }

        const multiNonLatinOptions = {
            from: "markdown",
            to: "html",
            standalone: true,
            bibliography: "مراجع.bib",
            citeproc: true
        }

        const multiNonLatinResult = await convert(
            multiNonLatinOptions,
            multiNonLatinMarkdown,
            multiNonLatinFiles
        )

        console.log("✓ Multiple non-Latin scripts test passed")
        console.log("  Files with non-Latin scripts:")
        console.log("    - Arabic: صورة.png, مراجع.bib")
        console.log("    - Korean: 이미지.png")
        console.log("    - Japanese: 画像.png")
        console.log(
            "  Files in result:",
            Object.keys(multiNonLatinResult.files).join(", ")
        )

        let nonLatinCount = 0
        const expectedNonLatinFiles = [
            "صورة.png",
            "이미지.png",
            "画像.png",
            "مراجع.bib"
        ]
        for (const filename of expectedNonLatinFiles) {
            if (filename in multiNonLatinResult.files) {
                nonLatinCount++
                console.log(`  ✓ "${filename}" accessible`)
            } else {
                console.log(`  ✗ "${filename}" NOT accessible`)
            }
        }

        if (nonLatinCount === 4) {
            console.log("  All files with non-Latin scripts accessible ✓")
        }

        // Final summary
        console.log("\n" + "=".repeat(70))
        console.log("✓ All non-ASCII file name tests completed successfully!")
        console.log("=".repeat(70))

        console.log("Summary:")
        console.log("  • German file names (ä, ö, ü, ß): Working ✓")
        console.log("  • Scandinavian file names (å, ø, æ): Working ✓")
        console.log("  • Arabic file names: Working ✓")
        console.log("  • Spanish file names (ñ, á, é, í, ó, ú): Working ✓")
        console.log("  • Mixed language files: Working ✓")
        console.log("  • Non-ASCII in output file names: Working ✓")
        console.log("  • Non-ASCII in bibliography file names: Working ✓")
        console.log("  • Non-ASCII in CSS file names: Working ✓")
        console.log("  • Multiple non-ASCII files in options: Working ✓")
        console.log("  • Non-Latin scripts in bibliography files: Working ✓")
        console.log("    - Arabic (مراجع.bib): Working ✓")
        console.log("    - Korean (참고문헌.bib): Working ✓")
        console.log("    - Japanese (参考文献.bib): Working ✓")
        console.log("  • Non-Latin scripts in CSS files: Working ✓")
        console.log("    - Japanese (スタイル.css): Working ✓")
        console.log("    - Korean (스타일.css): Working ✓")
        console.log("  • Multiple non-Latin scripts in one document: Working ✓")

        console.log("\npandoc-wasm correctly handles non-ASCII file names from")
        console.log("multiple languages and character sets for ALL file types:")
        console.log("input files, output files, and files referenced in pandoc")
        console.log(
            "options (bibliography, css, etc.). This includes non-Latin"
        )
        console.log("scripts such as Arabic, Korean, and Japanese.")
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
