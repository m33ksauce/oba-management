import { Module } from '@nestjs/common';
import { ReleasesController } from './controllers/releases/releases.controller';
import { AudioFilesController } from './controllers/audio-files/audio-files.controller';
import { AudioFilesService } from './controllers/services/audio-files.service';
import { AudioFile } from './entities/audio-file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: 'localhost',
      port: 27017,
      username: 'obasys',
      password: 'oba_login',
      database: 'oba',
      entities: [AudioFile],
    }),
    TypeOrmModule.forFeature([AudioFile]),
  ],
  controllers: [
    ReleasesController,
    AudioFilesController,
  ],
  providers: [
    AudioFilesService
  ]
})
export class ApiModule {}
