import { ReadCategoryDTO } from "../dto/dto";

export class ReadCategoryDTOMappers {
    public static FromDB(input: any): ReadCategoryDTO {
        return {
            id: input[0],
            parent_id: input[1],
            name: input[2],
        }
    }
}