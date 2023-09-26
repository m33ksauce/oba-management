export interface CreateTranslationInfoDTO {
    Settings: TranslationSettings
}

export interface ReadTranslationInfoDTO {
    id: string,
    LatestVersion: string,
    Settings: TranslationSettings
}

interface TranslationSettings {
    ProjectName: string;
    AppName: string;
    LanguageName: string;
    Location: string;
}

export interface UpdateTranslationInfoDTO {
    Settings: TranslationSettings
}