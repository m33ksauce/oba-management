// Interfaces

export enum ChildItemType {
    Categroy = 1,
    Audio
}

interface ChildItem {
    type: ChildItemType
    name: string
}

// Models

export interface ReleaseModel {
    Version: string,
    Categories: (CategoryChild|AudioChild)[],
    Audio: AudioEntry[]
}

export interface CategoryChild extends ChildItem {
    children: ChildItem[]
}

export interface AudioChild extends ChildItem {
    audioTargetId: string
}

export interface AudioEntry {
    id: string,
    file: string
}

