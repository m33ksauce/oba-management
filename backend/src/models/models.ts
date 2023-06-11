import { ChildItem } from "./interfaces";


export interface ReleaseModel {
    Version: string,
    Categories: unknown[],
    Audio: unknown[]
}

export class CategoryModel {
    public name: string;
    private categories: ChildItem[];

    constructor(name: string) {
        this.name = name;
        this.categories = [];
    }

    public addChild(item: ChildItem) {
        this.categories.push(item)
    }

    public removeChild(id: string) {
        this.categories = this.categories.filter(ch => ch.id == id);
    }
}

export interface TranslationSettingsModel {
    ProjectName: string;
    AppName: string;
    LanguageName: string;
    Location: string;
}

export interface TranslationModel {
    id: string;
    name: string;
    settings: TranslationSettingsModel;
}