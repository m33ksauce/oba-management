export default interface MetadataModel {
    Version: string
    Categories?: MetadataCategory[]
    Audio?: any
}

export interface MetadataCategory {
    title: string
    children: any
}

// export interface