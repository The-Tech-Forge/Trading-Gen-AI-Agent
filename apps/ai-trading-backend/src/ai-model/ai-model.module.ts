import { Module } from '@nestjs/common';
import { AiModelService } from './ai-model.service.js';
import { AiModelController } from './ai-model.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AIProvider } from './entities/ai-provider.entity.js';
import { AIModel } from './entities/ai-model.entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature(
      [
        AIProvider,
        AIModel
      ]
    )
  ],
  controllers: [AiModelController],
  providers: [AiModelService],
})
export class AiModelModule { }
