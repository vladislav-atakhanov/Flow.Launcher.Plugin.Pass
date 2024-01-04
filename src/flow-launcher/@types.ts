export interface JsonRPCAction {
    method: string
    parameters: string[]
}

export interface Result {
    Title: string
    Subtitle?: string
    JsonRPCAction?: JsonRPCAction
    IcoPath?: string
    ContextData: string[]
}
