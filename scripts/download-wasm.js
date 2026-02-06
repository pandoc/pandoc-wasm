#!/usr/bin/env node

/**
 * Download official pandoc.wasm binary from GitHub releases
 * This script is run during package preparation (before publishing) to fetch the pandoc WASM binary
 *
 * Version is read from pandoc-version.txt
 * Only skips download if existing WASM matches the target version
 *
 * The downloaded pandoc.wasm is committed to the repository and distributed with the npm package.
 */

import fs from "fs"
import https from "https"
import path from "path"
import {fileURLToPath} from "url"
import zlib from "zlib"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Paths
const PROJECT_ROOT = path.join(__dirname, "..")
const VERSION_FILE = path.join(PROJECT_ROOT, "pandoc-version.txt")
const SRC_DIR = path.join(PROJECT_ROOT, "src")
const WASM_FILE = path.join(SRC_DIR, "pandoc.wasm")
const VERSION_CACHE_FILE = path.join(SRC_DIR, ".pandoc-wasm-version")

/**
 * Read Pandoc version from pandoc-version.txt
 */
function getPandocVersion() {
    try {
        const version = fs.readFileSync(VERSION_FILE, "utf8").trim()
        if (!version) {
            throw new Error("Version file is empty")
        }
        return version
    } catch (error) {
        console.error(`Error reading ${VERSION_FILE}:`, error.message)
        console.error(
            "Please ensure pandoc-version.txt exists and contains a valid version"
        )
        process.exit(1)
    }
}

/**
 * Get the version of the currently downloaded WASM (if any)
 */
function getCachedVersion() {
    try {
        if (fs.existsSync(VERSION_CACHE_FILE)) {
            return fs.readFileSync(VERSION_CACHE_FILE, "utf8").trim()
        }
    } catch (_error) {
        // Ignore errors, treat as no cached version
    }
    return null
}

/**
 * Save the version of the downloaded WASM
 */
function saveCachedVersion(version) {
    try {
        fs.writeFileSync(VERSION_CACHE_FILE, version, "utf8")
    } catch (error) {
        console.warn("Warning: Could not save version cache:", error.message)
    }
}

/**
 * Download file from URL
 */
function downloadFile(url) {
    return new Promise((resolve, reject) => {
        https
            .get(url, response => {
                if (
                    response.statusCode === 302 ||
                    response.statusCode === 301
                ) {
                    // Follow redirect
                    downloadFile(response.headers.location)
                        .then(resolve)
                        .catch(reject)
                    return
                }

                if (response.statusCode !== 200) {
                    reject(
                        new Error(
                            `Failed to download: ${response.statusCode} ${response.statusMessage}`
                        )
                    )
                    return
                }

                const chunks = []
                response.on("data", chunk => chunks.push(chunk))
                response.on("end", () => resolve(Buffer.concat(chunks)))
                response.on("error", reject)
            })
            .on("error", reject)
    })
}

/**
 * Extract file from ZIP buffer
 */
function extractFromZip(zipBuffer, filename) {
    // Simple ZIP parsing - look for local file header
    const signature = Buffer.from([0x50, 0x4b, 0x03, 0x04]) // PK\x03\x04
    let offset = 0

    while (offset < zipBuffer.length - 30) {
        if (zipBuffer.slice(offset, offset + 4).equals(signature)) {
            const filenameLength = zipBuffer.readUInt16LE(offset + 26)
            const extraFieldLength = zipBuffer.readUInt16LE(offset + 28)
            const compressionMethod = zipBuffer.readUInt16LE(offset + 8)
            const compressedSize = zipBuffer.readUInt32LE(offset + 18)

            const nameStart = offset + 30
            const nameEnd = nameStart + filenameLength
            const name = zipBuffer.slice(nameStart, nameEnd).toString("utf8")

            if (name === filename || name.endsWith("/" + filename)) {
                const dataStart = nameEnd + extraFieldLength
                const dataEnd = dataStart + compressedSize
                const data = zipBuffer.slice(dataStart, dataEnd)

                if (compressionMethod === 0) {
                    // No compression
                    return data
                } else if (compressionMethod === 8) {
                    // Deflate compression
                    return zlib.inflateRawSync(data)
                } else {
                    throw new Error(
                        `Unsupported compression method: ${compressionMethod}`
                    )
                }
            }

            offset = nameEnd + extraFieldLength + compressedSize
        } else {
            offset++
        }
    }

    throw new Error(`File ${filename} not found in ZIP archive`)
}

/**
 * Main download and extraction logic
 */
async function main() {
    try {
        // Read target version from pandoc-version.txt
        const targetVersion = getPandocVersion()
        console.log(`Target Pandoc version: ${targetVersion}`)

        const GITHUB_RELEASE_URL = `https://github.com/jgm/pandoc/releases/download/${targetVersion}/pandoc-${targetVersion}.wasm.zip`

        // Ensure src directory exists
        if (!fs.existsSync(SRC_DIR)) {
            fs.mkdirSync(SRC_DIR, {recursive: true})
        }

        // Check if we already have the correct version
        const cachedVersion = getCachedVersion()
        if (cachedVersion === targetVersion && fs.existsSync(WASM_FILE)) {
            console.log(
                `✓ pandoc.wasm version ${targetVersion} already downloaded, skipping`
            )
            return
        }

        if (cachedVersion && cachedVersion !== targetVersion) {
            console.log(
                `Cached version (${cachedVersion}) differs from target (${targetVersion})`
            )
            console.log(`Downloading new version...`)
        } else if (fs.existsSync(WASM_FILE)) {
            console.log(
                `pandoc.wasm exists but version unknown, re-downloading...`
            )
        }

        console.log(
            `\nDownloading Pandoc ${targetVersion} WASM binary from GitHub...`
        )
        console.log(`URL: ${GITHUB_RELEASE_URL}`)

        const zipBuffer = await downloadFile(GITHUB_RELEASE_URL)
        console.log(
            `✓ Downloaded ${(zipBuffer.length / 1024 / 1024).toFixed(2)} MB`
        )

        // Extract pandoc.wasm
        console.log("Extracting pandoc.wasm...")
        const wasmData = extractFromZip(zipBuffer, "pandoc.wasm")
        fs.writeFileSync(WASM_FILE, wasmData)
        console.log(
            `✓ Extracted pandoc.wasm (${(wasmData.length / 1024 / 1024).toFixed(2)} MB)`
        )

        // Save version for future checks
        saveCachedVersion(targetVersion)

        console.log(
            `✓ Successfully downloaded Pandoc ${targetVersion} WASM binary`
        )
        console.log("  (pandoc.js wrapper is provided by pandoc-wasm package)")
    } catch (error) {
        console.error("\n❌ Error downloading pandoc WASM:", error.message)
        console.error("\nYou can manually download pandoc.wasm from:")
        console.error("  https://github.com/jgm/pandoc/releases")
        console.error(
            "\nDownload the pandoc-X.X.wasm.zip file for your version,"
        )
        console.error(`extract pandoc.wasm to: ${SRC_DIR}`)
        console.error(
            "\nOr update pandoc-version.txt to a version that exists on GitHub."
        )
        process.exit(1)
    }
}

main()
