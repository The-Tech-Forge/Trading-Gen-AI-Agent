import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { TempUser } from './entity/temp-user.entity.js';
import { OTPVerification, OTPType } from './entity/otp-verification.entity.js';
import { User } from '../users/entities/user.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TempUser)
    private readonly tempUserRepo: Repository<TempUser>,
    @InjectRepository(OTPVerification)
    private readonly otpRepo: Repository<OTPVerification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) { }


  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({
      where: [{ email: dto.email }, { phone_no: dto.phone_no }],
    });
    if (existingUser) {
      throw new ConflictException(
        'An account with this email or phone number already exists.',
      );
    }

    await this.tempUserRepo.delete({ email: dto.email });

    const password_hash = await bcrypt.hash(dto.password, 12);

    const tempUser = this.tempUserRepo.create({
      first_name: dto.first_name,
      middle_name: dto.middle_name,
      last_name: dto.last_name,
      email: dto.email,
      phone_no: dto.phone_no,
      password_hash,
    });
    await this.tempUserRepo.save(tempUser);

    const otp = this.generateOtp();
    await this.saveOtp(dto.email, otp, OTPType.Email);

    console.log(`[DEV] Email OTP for ${dto.email}: ${otp}`);

    return {
      message:
        'Registration initiated. Please verify your email with the OTP sent.',
    };
  }


  async verifyOtp(dto: VerifyOtpDto) {
    const otpRecord = await this.otpRepo.findOne({
      where: { contact: dto.contact, type: dto.type, is_used: false },
      order: { created_at: 'DESC' },
    });

    if (!otpRecord) {
      throw new NotFoundException('No active OTP found for this contact.');
    }
    if (new Date() > otpRecord.expire_at) {
      throw new BadRequestException('OTP has expired. Please request a new one.');
    }
    if (otpRecord.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.otpRepo.save(otpRecord);

    const tempUser = await this.tempUserRepo.findOne({
      where: { email: dto.contact },
    });
    if (!tempUser) {
      throw new NotFoundException(
        'Registration session expired. Please register again.',
      );
    }

    const user = this.userRepo.create({
      first_name: tempUser.first_name,
      middle_name: tempUser.middle_name,
      last_name: tempUser.last_name,
      email: tempUser.email,
      phone_no: tempUser.phone_no,
      password_hash: tempUser.password_hash,
      is_email_verified: dto.type === OTPType.Email,
      is_phone_verified: dto.type === OTPType.Mobile,
    });
    await this.userRepo.save(user);

    await this.tempUserRepo.delete({ temp_user_id: tempUser.temp_user_id });

    return {
      message: 'Account verified successfully. You can now log in.',
      user_id: user.user_id,
    };
  }


  private generateOtp(length = 6): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
  }

  private async saveOtp(
    contact: string,
    otp: string,
    type: OTPType,
  ): Promise<void> {
    await this.otpRepo.update(
      { contact, type, is_used: false },
      { is_used: true },
    );

    const expireAt = new Date();
    expireAt.setMinutes(expireAt.getMinutes() + 10); // 10-minute window

    const record = this.otpRepo.create({
      otp,
      type,
      contact,
      expire_at: expireAt,
    });
    await this.otpRepo.save(record);
  }
}
