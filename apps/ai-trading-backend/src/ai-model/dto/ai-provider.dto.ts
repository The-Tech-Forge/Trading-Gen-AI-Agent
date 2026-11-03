import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { AIModel } from "../entities/ai-model.entity.js";
import { Type } from "class-transformer";

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
    @Type(() => AIModel)
    ai_model: AIModel[]
}