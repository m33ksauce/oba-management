import { Module } from '@nestjs/common';
import { ReleasesController } from './controllers/releases/releases.controller';
import { AudioFilesController } from './controllers/audio-files/audio-files.controller';

@Module({
  controllers: [
    ReleasesController,
    AudioFilesController,
  ]
})
export class ApiModule {}
