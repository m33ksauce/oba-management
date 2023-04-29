import { ReadCategoryDTO, UpdateAudioResultDTO } from "../dto/dto";

export class ReadCategoryDTOMappers {
    public static FromDB(input: any): ReadCategoryDTO {
        if (input.target != undefined) {
            return {
                id: input.id,
                parent_id: input.parent_id,
                name: input.name,
                target: input.target,
            }
        }

        return {
            id: input.id,
            parent_id: input.parent_id,
            name: input.name,
        }
    }
}

export class UpdateAudioResultDTOMappers {
    public static FromDB(input: any): UpdateAudioResultDTO {
        return {
            id: input.id,
            parent_id: input.category_id,
            name: input.name,
        }
    }
}