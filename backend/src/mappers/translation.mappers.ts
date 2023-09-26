import { ReadTranslationInfoDTO } from "../dto/translation.dto";

export class TranslationInfoDTOMappers {
    public static FromDB(input: any): ReadTranslationInfoDTO {
        return {
            id: input.id,
            LatestVersion: input.latest_version,
            Settings: input.settings_object,
        }
    }
}