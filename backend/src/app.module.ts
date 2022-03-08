import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApiModule } from './api/api.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ApiModule,
    RouterModule.register([
      {
        path: 'api',
        module: ApiModule,
      }
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
