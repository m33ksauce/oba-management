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
    PublishMetadata(translation: string, md: Metadata): void,
    PublishMedia(translation: string, id: string, mime: string, file: Buffer): Promise<void>,
}