import { run, register } from "./flow-launcher/index.js"
import { generate, insert, find, read } from "./pass/index.js"
import clipboard from "clipboardy"

import { generatePassword, addPassword } from "./views/index.js"
import { app, key, deleteKey } from "./icons.js"

const DEFAULT_LENGTH = 20

register("generate", ([length]) => {
    const password = generate(length)
    clipboard.writeSync(password)
})
register("addToStorage", (args) => {
    args[2] = args[2] || generate(DEFAULT_LENGTH)
    clipboard.write(args[2])
    insert(...args)
})
register("copyPassword", ([id]) => {
    const { password } = read(id)
    clipboard.write(password)
})
register("copyUsername", ([id]) => {
    const { username } = read(id)
    clipboard.write(username)
})

export const main = () => {
    run(
        ([action, ...params]) => {
            const int = parseInt(action)
            if (!action || int)
                return generatePassword(action ? int : DEFAULT_LENGTH)
            if (["add", "new", "create"].includes(action))
                return addPassword(params)

            const found = find(action)
            if (found.length > 0) {
                return found.map(({ folder, file, id }) => ({
                    Title: `${file} - ${folder}`,
                    Subtitle: "Copy password to clipboard",
                    JsonRPCAction: {
                        method: "copyPassword",
                        parameters: [id],
                    },
                    ContextData: ["entry", { id, folder, file }],
                    IcoPath: key,
                }))
            }

            return {
                Title: "Unknown",
                Subtitle: JSON.stringify(action),
                IcoPath: app,
            }
        },
        ([action, ...other]) => {
            const [{ folder, file, id }] = other
            if (action === "entry")
                return [
                    {
                        Title: `Copy username`,
                        Subtitle: `Copy username for ${file}`,
                        JsonRPCAction: {
                            method: "copyUsername",
                            parameters: [id],
                        },
                        IcoPath: app,
                    },
                    {
                        Title: `Delete ${file}`,
                        Subtitle: `Delete from ${folder}`,
                        IcoPath: deleteKey,
                    },
                ]
        }
    )
}
