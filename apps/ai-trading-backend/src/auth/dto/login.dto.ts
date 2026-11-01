import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class LoginDTO {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsStrongPassword(
        {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        {
            message: "Message is too weak please, Please reset your Password!"

        })
    @IsNotEmpty()
    password: string
}