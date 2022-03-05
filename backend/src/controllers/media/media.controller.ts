import { Controller, Get } from '@nestjs/common';
import { MediaBlob } from 'src/entities/media-blob.entity';
import { MediaService } from 'src/services/media/media.service';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Get()
    getHello(): MediaBlob {
        return this.mediaService.create();
  }
}
