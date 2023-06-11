import { ReadTranslationInfoDTO } from "../dto/translation.dto";

export class TranslationInfoDTOMappers {
    public static FromDB(input: any): ReadTranslationInfoDTO {
        return {
            id: input.id,
            Settings: input.settings_object,
        }
    }
}