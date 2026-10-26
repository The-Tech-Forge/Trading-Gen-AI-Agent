import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** Holds registration data until the user verifies their email/phone */
@Entity('temp_users')
export class TempUser {
  @PrimaryGeneratedColumn()
  temp_user_id: number;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100, nullable: true })
  middle_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ length: 20 })
  phone_no: string;

  @Column({ length: 255 })
  email: string;

  @Column()
  password_hash: string;

  @CreateDateColumn()
  created_at: Date;

  /** Row auto-expires after 24 hours — enforce via a DB job or cleanup cron */
  @Column({
    type: 'timestamptz',
    default: () => `NOW() + INTERVAL '24 hours'`,
  })
  expire_at: Date;
}
