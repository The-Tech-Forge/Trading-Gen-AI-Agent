import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { TempUser } from './entity/temp-user.entity.js';
import { OTPVerification } from './entity/otp-verification.entity.js';
import { User } from '../users/entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([TempUser, OTPVerification, User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
