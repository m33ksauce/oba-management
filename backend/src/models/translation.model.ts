import { TranslationSettingsModel } from "./translation_settings.model";


export interface TranslationModel {
    id: string;
    name: string;
    settings: TranslationSettingsModel;
    lastestVersion: string;
}
