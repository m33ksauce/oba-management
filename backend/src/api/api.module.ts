import { Module } from '@nestjs/common';
import { BundlesController } from './bundles/bundles.controller';

@Module({
  controllers: [BundlesController]
})
export class ApiModule {}
