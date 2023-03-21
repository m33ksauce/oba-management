import { ReadCategoryDTO } from "../dto/dto";

export class ReadCategoryDTOMappers {
    public static FromDB(input: any): ReadCategoryDTO {
        return {
            id: input.id,
            parent_id: input.parent_id,
            name: input.name,
        }
    }
}