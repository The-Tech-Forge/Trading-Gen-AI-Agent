import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1793442753669 implements MigrationInterface {
    name = 'InitialMigration1793442753669'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."otp_verifications_type_enum" AS ENUM('Mobile', 'Email')`);
        await queryRunner.query(`CREATE TABLE "otp_verifications" ("otp_id" SERIAL NOT NULL, "otp" character varying(10) NOT NULL, "type" "public"."otp_verifications_type_enum" NOT NULL DEFAULT 'Email', "contact" character varying(255) NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_used" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2ba0d19b7a6bf47ccc951a3ab91" PRIMARY KEY ("otp_id"))`);
        await queryRunner.query(`CREATE TABLE "temp_users" ("temp_user_id" SERIAL NOT NULL, "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "last_name" character varying(100) NOT NULL, "phone_no" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '24 hours', CONSTRAINT "PK_9703bd6135f351cbcdea8d9fc25" PRIMARY KEY ("temp_user_id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying(100) NOT NULL, "middle_name" character varying(100), "last_name" character varying(100) NOT NULL, "phone_no" character varying(20) NOT NULL, "email" character varying(255) NOT NULL, "password_hash" character varying NOT NULL, "is_email_verified" boolean NOT NULL DEFAULT false, "is_phone_verified" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e84ed8eafd2812aaf53a33064d2" UNIQUE ("phone_no"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_96aac72f1574b88752e9fb00089" PRIMARY KEY ("user_id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "temp_users"`);
        await queryRunner.query(`DROP TABLE "otp_verifications"`);
        await queryRunner.query(`DROP TYPE "public"."otp_verifications_type_enum"`);
    }

}
