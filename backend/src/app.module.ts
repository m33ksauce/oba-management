import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaService } from './services/media/media.service';
import { MediaController } from './controllers/media/media.controller';
import { MediaBlob } from './entities/media-blob.entity';
import { ApiModule } from './api/api.module';
import { BundlesController } from './bundles/bundles.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'mongodb',
        host: 'localhost',
        port: 27017,
        username: 'obasys',
        password: 'oba_login',
        database: 'oba',
        entities: [MediaBlob],
    }),
    TypeOrmModule.forFeature([MediaBlob]),
    ApiModule
  ],
  controllers: [AppController, MediaController, BundlesController],
  providers: [AppService, MediaService],
})
export class AppModule {}
