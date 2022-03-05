import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaBlob } from 'src/entities/media-blob.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {

    constructor(
        @InjectRepository(MediaBlob)
        private mediaBlobRepository: Repository<MediaBlob>,
    ) {}

    create(): MediaBlob {
        var blob = this.mediaBlobRepository.create();
        this.mediaBlobRepository.save(blob);
        return blob;
    }
}
