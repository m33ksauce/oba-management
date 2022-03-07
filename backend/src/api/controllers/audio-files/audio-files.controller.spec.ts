import { Test, TestingModule } from '@nestjs/testing';
import { AudioFilesController } from './audio-files.controller';

describe('AudioFilesController', () => {
  let controller: AudioFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioFilesController],
    }).compile();

    controller = module.get<AudioFilesController>(AudioFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
