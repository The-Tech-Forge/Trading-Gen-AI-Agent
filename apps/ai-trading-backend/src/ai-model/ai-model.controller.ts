import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AiModelService } from './ai-model.service.js';
import { AIProviderDTO } from './dto/ai-provider.dto.js';
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

  @Get("/provider")
  findAll(@CurrentUser() user: ReqUser) {
    return this.aiModelService.findAll(user.user_type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aiModelService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAiModelDto: UpdateAiModelDto) {
  //   return this.aiModelService.update(+id, updateAiModelDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aiModelService.remove(+id);
  }
}
