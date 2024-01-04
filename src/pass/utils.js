import { existsSync, mkdirSync } from "node:fs"

/** @param {string} folder */
export const ensureFolder = (folder) => {
    if (existsSync(folder)) return
    mkdirSync(folder)
}

/** @param {number} length */
export const generate = (
    length,
    characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) =>
    Array(length)
        .fill(1)
        .map(() => characters[Math.floor(Math.random() * characters.length)])
        .join("")
