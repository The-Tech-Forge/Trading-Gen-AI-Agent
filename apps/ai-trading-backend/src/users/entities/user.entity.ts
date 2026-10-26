import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100, nullable: true })
  middle_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Column({ unique: true, length: 20 })
  phone_no: string;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ default: false })
  is_email_verified: boolean;

  @Column({ default: false })
  is_phone_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;
}
