import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMetadataDto } from "src/api/dto/create-metadata-file";
import { AudioFile } from "src/api/entities/audio-file.entity";
import { Metadata } from "src/api/entities/metadata.entity";
import { Repository } from "typeorm";
import { MetadataMappers } from "../mappers/metadata.mapper";

@Injectable()
export class MetadataService {
    constructor(
        @InjectRepository(AudioFile)
        private metadataRepo: Repository<Metadata>,
    ) {}

    create(createMetadataDto: CreateMetadataDto) {
        return new Promise((resolve, _) => {
            var metadata = MetadataMappers.DtoToEntity(createMetadataDto);
            this.metadataRepo.save(metadata);
            resolve(metadata);
        });
    }

    findAll(): Promise<Metadata[]> {
        return this.metadataRepo.find();
    }
}