import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateMetadataDto } from 'src/api/dto/create-metadata-file';
import { MetadataService } from '../../services/metadata.services';

@Controller('metadata')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}

    @Post()
    create(@Body() createMetadataDto: CreateMetadataDto) {
        console.log("made it")
        return this.metadataService.create(createMetadataDto);
    }

    @Get()
    findAll() {
        return this.metadataService.findAll();
    }
}
