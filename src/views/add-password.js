import { addKey } from "../icons.js"

export const addPassword = (params) => {
    const length = params.length
    if (length === 0)
        return [
            {
                Title: "Generate password and add to storage",
                Subtitle: "<label> <username>",
                IcoPath: addKey,
            },
            {
                Title: "Add password to storage",
                Subtitle: "<label> <username> <password>",
                IcoPath: addKey,
            },
        ]
    const [label, username, password, ...other] = params
    if (length === 1)
        return [
            {
                Title: "Generate password and add to storage",
                Subtitle: `${label} <username>`,
                IcoPath: addKey,
            },
            {
                Title: "Add password to storage",
                Subtitle: `${label} <username> <password>`,
                IcoPath: addKey,
            },
        ]
    if (length === 2)
        return [
            {
                Title: "Generate password and add to storage",
                Subtitle: `${label} - ${username}`,
                JsonRPCAction: {
                    method: "addToStorage",
                    parameters: [label, username],
                },
                IcoPath: addKey,
            },
            {
                Title: "Add password to storage",
                Subtitle: `${label} ${username} <password>`,
                IcoPath: addKey,
            },
        ]
    return {
        Title: "Add password to storage",
        Subtitle: `${label} - ${username}`,
        JsonRPCAction: {
            method: "addToStorage",
            parameters: [label, username, password],
        },
        IcoPath: addKey,
    }
}
