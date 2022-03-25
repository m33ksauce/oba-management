import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { resolve } from "path/posix";
import { CreateAudioFileDto } from "src/api/dto/create-audio-file";
import { AudioFile } from "src/api/entities/audio-file.entity";
import { Repository } from "typeorm";

@Injectable()
export class AudioFilesService {
    constructor(
        @InjectRepository(AudioFile)
        private audioFileRepository: Repository<AudioFile>,
    ) {}
    
    create(createAudioFileDto: CreateAudioFileDto): Promise<AudioFile> {
        return new Promise((resolve, _) => {
            var file = new AudioFile();
            this.audioFileRepository.save(file);
            resolve(file);
        });       
    }

    findAll(): Promise<AudioFile[]> {
        return this.audioFileRepository.find();
    }
}