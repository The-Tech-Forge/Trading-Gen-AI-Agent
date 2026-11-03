import { Injectable } from '@nestjs/common';
import { AIProviderDTO } from './dto/ai-provider.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AIProvider } from './entities/ai-provider.entity.js';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity.js';
import { UserType } from '../users/entities/user.entity.js';

@Injectable()
export class AiModelService {

  constructor(
    @InjectRepository(AIProvider) private providerRepo: Repository<AIProvider>,
    @InjectRepository(AIModel) private modelRepo: Repository<AIModel>,
  ) { }

  async create(createAiModelDto: AIProviderDTO) {
    const provider = await this.providerRepo.save({
      provider: createAiModelDto.provider,
      description: createAiModelDto.description,
      website: createAiModelDto.website,
      is_active: createAiModelDto.is_active
    })

    const model_entities: AIModel[] = [];

    if (createAiModelDto.ai_model) {
      for (const model_data of createAiModelDto.ai_model) {
        const model = await this.modelRepo.save({
          model: model_data.model,
          description: model_data.description,
          is_active: model_data.is_active,
          provider: provider,
        })

        model_entities.push(model)
      }
    }

    provider.ai_models = model_entities;
    return {
      status: true,
      ai_provider: provider,
    }

  }

  async findAll(user_type: UserType) {
    const ai_provider = await this.providerRepo.find({
      where: {
        is_active: user_type === UserType.ADMIN ? true : false,
      },
      relations: {
        ai_models: true,
      },
    })

    return {
      status: true,
      ai_provider: ai_provider,
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} aiModel`;
  }

  // update(id: number, updateAiModelDto: UpdateAiModelDto) {
  //   return `This action updates a #${id} aiModel`;
  // }

  remove(id: number) {
    return `This action removes a #${id} aiModel`;
  }
}
