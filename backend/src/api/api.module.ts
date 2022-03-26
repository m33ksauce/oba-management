import { Module } from '@nestjs/common';
import { ReleasesController } from './controllers/releases/releases.controller';
import { AudioFilesController } from './controllers/audio-files/audio-files.controller';
import { AudioFilesService } from './services/audio-files.service';
import { AudioFile } from './entities/audio-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { MetadataController } from './controllers/metadata/metadata.controller';
import { MetadataService } from './services/metadata.services';
import { Metadata } from './entities/metadata.entity';
import { Release } from './entities/release.entity';
import { ReleaseService } from './services/release.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: 'obasys',
      password: 'oba_login',
      database: 'oba',
      entities: [
        AudioFile,
        Metadata,
        Release,
      ],
    }),
    TypeOrmModule.forFeature([AudioFile]),
    TypeOrmModule.forFeature([Metadata]),
    TypeOrmModule.forFeature([Release]),
    MulterModule.register(),
  ],
  controllers: [
    ReleasesController,
    AudioFilesController,
    MetadataController,
  ],
  providers: [
    AudioFilesService,
    MetadataService,
    ReleaseService,
  ]
})
export class ApiModule {}
