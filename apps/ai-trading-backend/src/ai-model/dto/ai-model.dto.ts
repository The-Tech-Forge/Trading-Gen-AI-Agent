import { IsBoolean, IsNotEmpty, IsString } from "class-validator";


export class AIModelDto {
    @IsString()
    @IsNotEmpty()
    model: string

    @IsString()
    @IsNotEmpty()
    description: string

    @IsBoolean()
    @IsNotEmpty()
    is_active: boolean
}
