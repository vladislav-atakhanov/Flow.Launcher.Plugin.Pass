const handlers = new Map()

/**
 * @param {(parameters: string[]) => Result[]} root
 * @param {(parameters: string[]) => Result[]} [context]
 */
export const run = (root, context) => {
    register("query", root)
    if (context) register("context_menu", context)
    const r = main()
    if (!r) return

    const result = Array.isArray(r) ? r : [r]
    console.log(JSON.stringify({ result }))
}

/** @returns {Result[] | void}  */
const main = () => {
    const { method, parameters, settings } = JSON.parse(process.argv[2])
    const handler = handlers.get(method)
    if (!handler)
        return [
            {
                Title: `Handler for ${method} not found`,
                Subtitle: JSON.stringify({ parameters, settings }),
            },
        ]
    return handler(
        parameters
            .flatMap((p) => (typeof p === "string" ? p.split(" ") : p))
            .filter((p) => (typeof p === "string" ? p.length > 0 : true))
    )
}

/**
 *
 * @param {string} method
 * @param {(parameters: string[]) => void} cb
 */
export const register = (method, cb) => handlers.set(method, cb)

/**
 * @typedef Result
 * @type {import("./@types").Result}
 */
