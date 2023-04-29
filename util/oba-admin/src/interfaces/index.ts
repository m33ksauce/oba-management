export interface Metadata {
    Version: string,
    Categories: Category[],
    Audio: AudioFile[]
}

export interface Category {
    type: number,
    name: string,
    children: any[],
}

export interface AudioFile {
    file: string,
    id: string
}

export interface Publisher {
    PublishMetadata(translation: string, md: Metadata): void,
    PublishMedia(translation: string, id: string, mime: string, file: Buffer): Promise<void>,
    PublishCategories(translation: string, md: Metadata): void,
}