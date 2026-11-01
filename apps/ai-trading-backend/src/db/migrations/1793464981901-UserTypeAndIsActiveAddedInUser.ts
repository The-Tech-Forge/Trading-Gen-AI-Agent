import { MigrationInterface, QueryRunner } from "typeorm";

export class UserTypeAndIsActiveAddedInUser1793464981901 implements MigrationInterface {
    name = 'UserTypeAndIsActiveAddedInUser1793464981901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_user_type_enum" AS ENUM('default', 'admin')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "user_type" "public"."users_user_type_enum" NOT NULL DEFAULT 'default'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "is_active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "temp_users" ALTER COLUMN "expire_at" SET DEFAULT NOW() + INTERVAL '24 hours'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "temp_users" ALTER COLUMN "expire_at" SET DEFAULT (now() + '24:00:00')`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_active"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "user_type"`);
        await queryRunner.query(`DROP TYPE "public"."users_user_type_enum"`);
    }

}
