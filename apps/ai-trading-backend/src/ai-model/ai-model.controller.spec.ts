import { Test, TestingModule } from '@nestjs/testing';
import { AiModelController } from './ai-model.controller.js';
import { AiModelService } from './ai-model.service.js';

describe('AiModelController', () => {
  let controller: AiModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AiModelController],
      providers: [AiModelService],
    }).compile();

    controller = module.get<AiModelController>(AiModelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
