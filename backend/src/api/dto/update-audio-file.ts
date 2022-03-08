import { PartialType } from '@nestjs/mapped-types';
import { CreateAudioFileDto } from './create-audio-file';

export class UpdateAudioFileDto extends PartialType(CreateAudioFileDto) {}
