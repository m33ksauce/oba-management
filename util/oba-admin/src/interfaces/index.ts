export interface Metadata {
    Version: string,
    Categories: unknown[],
    Audio: AudioFile[]
}

export interface AudioFile {
    file: string,
    id: string
}

export interface Publisher {
    PublishMetadata(md: Metadata): void,
    PublishMedia(id: string, mime: string, file: Buffer): Promise<void>,
}