import { IsBoolean, IsDateString, IsDecimal, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from "class-validator";


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

export class CreateAiModelPricingDto {

    @IsString()
    @IsNotEmpty()
    ai_model_id: string;

    @IsDecimal({ decimal_digits: "0,10" })
    input_price: string;

    @IsDecimal({ decimal_digits: "0,10" })
    output_price: string;

    @IsString()
    @Length(3, 3)
    currency: string;

    @IsDateString()
    effective_from: string;
}