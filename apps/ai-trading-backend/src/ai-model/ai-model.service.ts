import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AIProviderDTO, UpdateAIProviderDto } from './dto/ai-provider.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { AIProvider } from './entities/ai-provider.entity.js';
import { Repository } from 'typeorm';
import { AIModel } from './entities/ai-model.entity.js';
import { UserType } from '../users/entities/user.entity.js';
import { Transactional } from 'typeorm-transactional';
import { AIModelPricing } from './entities/ai-model-pricing.entity.js';
import { CreateAiModelPricingDto } from './dto/ai-model.dto.js';

@Injectable()
export class AiModelService {

  constructor(
    @InjectRepository(AIProvider) private providerRepo: Repository<AIProvider>,
    @InjectRepository(AIModel) private modelRepo: Repository<AIModel>,
    @InjectRepository(AIModelPricing) private modelPricingRepo: Repository<AIModelPricing>
  ) { }

  @Transactional()
  async create(createAiModelDto: AIProviderDTO) {
    const provider = await this.providerRepo.save({
      provider: createAiModelDto.provider,
      description: createAiModelDto.description,
      website: createAiModelDto.website,
      is_active: createAiModelDto.is_active
    })


    if (createAiModelDto.ai_models) {
      for (const model_data of createAiModelDto.ai_models) {
        const model = await this.modelRepo.save({
          model: model_data.model,
          description: model_data.description,
          is_active: model_data.is_active,
          provider: {
            ai_provider_id: provider.ai_provider_id
          },
        })
      }
    }

    return {
      status: true,
      message: "New Provider Created Successfully.",
    }

  }

  async update(updateAiModelDto: UpdateAIProviderDto) {
    const provider = await this.providerRepo.findOne({
      where: {
        ai_provider_id: updateAiModelDto.ai_provider_id,
      },
    });

    if (!provider) {
      throw new NotFoundException('AI Provider not found');
    }

    provider.provider = updateAiModelDto.provider;
    provider.description = updateAiModelDto.description;
    provider.website = updateAiModelDto.website;
    provider.is_active = updateAiModelDto.is_active;

    await this.providerRepo.save(provider);

    if (updateAiModelDto.ai_models?.length) {

      for (const modelData of updateAiModelDto.ai_models) {

        const model = await this.modelRepo.findOne({
          where: {
            ai_model_id: modelData.ai_model_id,
            provider: {
              ai_provider_id: updateAiModelDto.ai_provider_id,
            },
          },
        });

        if (!model) {
          throw new NotFoundException(
            `AI Model ${modelData.ai_model_id} not found for this provider`,
          );
        }

        model.model = modelData.model;
        model.description = modelData.description;
        model.is_active = modelData.is_active;

        await this.modelRepo.save(model);
      }
    }

    return {
      status: true,
      message: "AI Provider and Models updated successfully",
    }

  }

  async findAll(user_type: UserType) {
    const isAdmin = user_type === UserType.ADMIN;
    const ai_provider = await this.providerRepo.find({
      where: isAdmin
        ? {}
        : {
          is_active: true,
          ai_models: {
            is_active: true,
          },
        },
      relations: {
        ai_models: true,
      },
    });

    return {
      status: true,
      ai_provider,
    };
  }

  @Transactional()
  async createPricing(dto: CreateAiModelPricingDto) {
    const model = await this.modelRepo.findOne({
      where: {
        ai_model_id: dto.ai_model_id
      }
    })

    if (!model) {
      throw new NotFoundException("AI model not found");
    }

    const effectiveFrom = new Date(dto.effective_from);

    if (effectiveFrom <= new Date()) {
      throw new BadRequestException(
        "Pricing must have a future effective date",
      );
    }

    const latestPricing = await this.modelPricingRepo.findOne({
      where: {
        model: {
          ai_model_id: dto.ai_model_id
        }
      },
      order: {
        effective_from: 'DESC'
      }
    })

    if (latestPricing) {
      if (
        latestPricing.effective_to &&
        effectiveFrom < latestPricing.effective_to
      ) {
        throw new ConflictException(
          "New pricing overlaps with existing pricing period",
        );
      }

      if (!latestPricing.effective_to) {
        latestPricing.effective_to = effectiveFrom
        await this.modelPricingRepo.save(latestPricing)
      }
    }

    const newPricing = await this.modelPricingRepo.save({
      input_price: dto.input_price,
      output_price: dto.output_price,
      currency: dto.currency.toUpperCase(),
      effective_from: effectiveFrom,
      effective_to: null,
      model: {
        ai_model_id: dto.ai_model_id
      }
    })

    return {
      status: true,
      message: "New Pricing Created Successfully",
      newPricing
    }
  }
}
