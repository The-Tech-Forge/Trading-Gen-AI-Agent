import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { OTPType } from '../entity/otp-verification.entity.js';

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
  contact: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  otp: string;

  @IsEnum(OTPType)
  type: OTPType;
}
