import { app } from "../icons.js"
export const generatePassword = (length) => ({
    Title: "Copy pass to clipboard",
    Subtitle: `Generate ${length}-symbol length password`,
    JsonRPCAction: {
        method: "generate",
        parameters: [length],
    },
    IcoPath: app,
})
