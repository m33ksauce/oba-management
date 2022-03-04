import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaService } from './services/media/media.service';
import { MediaController } from './controllers/media/media.controller';

@Module({
  imports: [],
  controllers: [AppController, MediaController],
  providers: [AppService, MediaService],
})
export class AppModule {}
