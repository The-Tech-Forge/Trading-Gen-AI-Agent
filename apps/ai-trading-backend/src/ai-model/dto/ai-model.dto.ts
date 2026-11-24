import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class AIModelDto {
    @IsString()
    @IsNotEmpty()
    model: string

    @IsString()
    @IsOptional()
    description: string

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean
}

export class UpdateAIModelDto extends AIModelDto {
    @IsString()
    @IsNotEmpty()
    ai_model_id: string
}