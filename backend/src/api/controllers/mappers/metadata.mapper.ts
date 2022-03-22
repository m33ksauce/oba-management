import { CreateMetadataDto } from "src/api/dto/create-metadata-file";
import { Metadata } from "src/api/entities/metadata.entity";

export class MetadataMappers {
    public static DtoToEntity(dto: CreateMetadataDto): Metadata {
        let meta = new Metadata();
        meta.categories = dto.Categories;
        meta.version = dto.Version;
        meta.isRelease = true;
        return meta;
    }
}