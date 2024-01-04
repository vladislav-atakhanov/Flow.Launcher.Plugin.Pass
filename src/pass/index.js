import { homedir } from "node:os"
import { writeFileSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { ensureFolder } from "./utils.js"
export { generate } from "./utils.js"

const EXTENSION = ".txt"
const STORAGE = join(homedir(), ".password-store")

/**
 * @template T
 * @param {T} cb
 * @returns T
 */
const useStorage = (cb) => {
    return (...args) => {
        ensureFolder(STORAGE)
        cb(...args)
    }
}

export const insert = useStorage(
    (label, username, password, website, comment) => {
        const folder = join(STORAGE, label)
        const file = join(folder, `${username}${EXTENSION}`)
        const head = Object.entries({ username, password, label, website })
            .map(([key, value]) => (value ? `${key}: ${value}` : null))
            .filter(Boolean)
            .join("\n")

        const content = comment ? `${head}\n\n${comment}` : head
        ensureFolder(folder)
        writeFileSync(file, content)
    }
)

/** @param {string} content */
const parseFile = (content) => {
    const [head, comment] = content.split("\n\n")
    const headEntries = Object.fromEntries(
        head.split("\n").map((line) => line.split(":").map((t) => t.trim()))
    )

    return headEntries
}

/** @param {string} id */
export const read = (id) => {
    const content = readFileSync(join(STORAGE, `${id}${EXTENSION}`), {
        encoding: "utf-8",
    })
    return parseFile(content)
}

/** @param {string} label */
export const find = (label) => {
    const folders = readdirSync(STORAGE).filter((f) => f.startsWith(label))
    return folders.flatMap((folder) => {
        const files = readdirSync(join(STORAGE, folder)).map((f) =>
            f.replace(new RegExp(`${EXTENSION}$`), "")
        )
        return files.map((f) => ({
            folder: folder,
            file: f,
            id: `${folder}/${f}`,
        }))
    })
}
