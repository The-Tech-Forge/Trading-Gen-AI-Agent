import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { VerifyOtpDto } from './dto/verify-otp.dto.js';
import { TempUser } from './entity/temp-user.entity.js';
import { OTPVerification, OTPType } from './entity/otp-verification.entity.js';
import { User, UserType } from '../users/entities/user.entity.js';
import { LoginDTO } from './dto/login.dto.js';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(TempUser)
    private readonly tempUserRepo: Repository<TempUser>,
    @InjectRepository(OTPVerification)
    private readonly otpRepo: Repository<OTPVerification>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly jwtService: JwtService,
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

  private setAuthTokenCookie(res: Response, token: string) {
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
  }

  private setRefreshTokenCookie(res: Response, token: string) {
    res.cookie("refresh_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    })
  }

  private async generateToken(user_id: string, user_type: UserType, email: string, generate_refresh: boolean, res: Response) {
    const auth_payload = {
      user_id: user_id,
      user_type: user_type,
      email: email
    }

    const auth_token = await this.jwtService.signAsync(auth_payload)
    this.setAuthTokenCookie(res, auth_token)

    if (generate_refresh) {
      const refresh_token = await this.jwtService.signAsync(
        auth_payload,
        {
          secret: process.env.REFRESH_SECRET,
          expiresIn: '1d'
        }
      )
      this.setRefreshTokenCookie(res, refresh_token)
    }

  }

  private async getUser(email: string) {
    const user = await this.userRepo.findOne({
      where: { email: email },
      select: {
        user_id: true,
        user_type: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        password_hash: true,
        email: true,
        phone_no: true,
        is_active: true
      }
    });

    if (!user) {
      throw new NotFoundException('Invalid Email or Password!');
    }

    if (!user.is_active) {
      throw new BadRequestException('Account is Inactive. Contact Support for Assistance.');
    }

    return user
  }

  private buildUserResponse(user: User) {
    return {
      user_id: user.user_id,
      user_type: user.user_type,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      email: user.email,
      phone_no: user.phone_no,
    }
  }

  async login(dto: LoginDTO, res: Response) {
    const user = await this.getUser(dto.email)

    const isPasswordValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Email or Password!');
    }

    await this.generateToken(user.user_id, user.user_type, user.email, true, res)
    return {
      message: 'Login successful.',
      user: this.buildUserResponse(user)
    };
  }

  async refresh(req: Request, res: Response) {
    const refresh_token = req.cookies.refresh_token
    if (!refresh_token) {
      throw new UnauthorizedException('Refresh token not found.')
    }
    const decodedToken = await this.jwtService.verifyAsync(refresh_token, {
      secret: process.env.REFRESH_SECRET
    })
    const user = await this.getUser(decodedToken.email)
    await this.generateToken(user.user_id, user.user_type, user.email, false, res)
    return {
      message: 'Refresh token successful.',
      user: this.buildUserResponse(user)
    }
  }
}