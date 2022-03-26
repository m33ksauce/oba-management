import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateMetadataDto } from "src/api/dto/create-metadata-file";
import { Metadata } from "src/api/entities/metadata.entity";
import { Repository } from "typeorm";
import { MetadataMappers } from "../controllers/mappers/metadata.mapper";

@Injectable()
export class MetadataService {
    constructor(
        @InjectRepository(Metadata)
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

    findOne(id: string): Promise<Metadata> {
        return this.metadataRepo.findOne(id);
    }

    findAllReleases(): Promise<Metadata[]> {
        return this.metadataRepo.find({isRelease: false});
    }
}