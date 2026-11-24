import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AIModelDto, UpdateAIModelDto } from "./ai-model.dto.js";
import { OmitType } from "@nestjs/mapped-types";

export class AIProviderDTO {
    @IsString()
    @IsNotEmpty()
    provider: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsUrl()
    @IsNotEmpty()
    website: string

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AIModelDto)
    ai_models: AIModelDto[]
}


export class UpdateAIProviderDto extends OmitType(
    AIProviderDTO,
    ['ai_models'] as const,
) {
    @IsString()
    @IsNotEmpty()
    ai_provider_id: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateAIModelDto)
    ai_models: UpdateAIModelDto[];
}