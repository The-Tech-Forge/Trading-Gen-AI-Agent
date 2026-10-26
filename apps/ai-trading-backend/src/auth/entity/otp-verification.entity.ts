import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum OTPType {
  Mobile = 'Mobile',
  Email = 'Email',
}

@Entity('otp_verifications')
export class OTPVerification {
  @PrimaryGeneratedColumn()
  otp_id: number;

  @Column({ length: 10 })
  otp: string;

  @Column({ type: 'enum', enum: OTPType, default: OTPType.Email })
  type: OTPType;

  /** Email address or phone number the OTP was sent to */
  @Column({ length: 255 })
  contact: string;

  @Column({ type: 'timestamptz' })
  expire_at: Date;

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
