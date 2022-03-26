import { Body, Controller, Get, Post } from '@nestjs/common';
import { MetadataService } from 'src/api/services/metadata.services';
import { ReleaseService } from 'src/api/services/release.service';

@Controller('releases')
export class ReleasesController {
    constructor(
        private readonly releaseService: ReleaseService,
        private readonly metadataService: MetadataService,
    ) {}

    @Post()
    async create(@Body() body) {
        var id = body.id;
        var ver = body.version;
        var md = await this.metadataService.findOne(id);
        return this.releaseService.create(ver, md);
    }

    @Get('latest')
    getLatest() {
        return this.releaseService.findLatest();
    }
}
