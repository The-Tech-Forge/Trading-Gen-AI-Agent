import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { AiModelService } from './ai-model.service.js';
import { AIProviderDTO, UpdateAIProviderDto } from './dto/ai-provider.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { UserType } from '../users/entities/user.entity.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { ReqUser } from '../types/current-user.type.js';

@Controller('ai-model')
export class AiModelController {
  constructor(private readonly aiModelService: AiModelService) { }

  @Roles(UserType.ADMIN)
  @Post("/provider")
  create(@Body() dto: AIProviderDTO) {
    return this.aiModelService.create(dto);
  }

  @Roles(UserType.ADMIN)
  @Put("/provider")
  update(@Body() dto: UpdateAIProviderDto) {
    return this.aiModelService.update(dto)
  }

  @Get("/provider")
  findAll(@CurrentUser() user: ReqUser) {
    return this.aiModelService.findAll(user.user_type);
  }
}
