import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAudioFileDto } from 'src/api/dto/create-audio-file';
import { AudioFilesService } from '../services/audio-files.service';

@Controller('audio-files')
export class AudioFilesController {
    constructor(private readonly audioFilesService: AudioFilesService) {}

    @Post()
    create(@Body() createAudioFileDto: CreateAudioFileDto) {
        return this.audioFilesService.create(createAudioFileDto);
    }

    @Get()
    findAll() {
        return this.audioFilesService.findAll();
    }
}
