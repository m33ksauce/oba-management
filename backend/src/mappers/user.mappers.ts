import { ReadUserDTO } from "../dto/user.dto";

export class ReadUserDTOMappers {
    public static FromDB(input: any): ReadUserDTO {
        let default_translation = "";
        let available_translations: string[] = [];

        if (input.translation != undefined) {
            default_translation = input.translation;
            available_translations = [input.translation];
        }

        return {
            email: input.email,
            default_translation: default_translation,
            default_translation_current_version: input.latest_version,
            available_translations: available_translations,
        }
    }
}