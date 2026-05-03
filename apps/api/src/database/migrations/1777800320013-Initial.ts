import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1777800320013 implements MigrationInterface {
    name = 'Initial1777800320013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."media_status_enum" AS ENUM('pending', 'processing', 'ready', 'failed')`);
        await queryRunner.query(`CREATE TABLE "media" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "status" "public"."media_status_enum" NOT NULL DEFAULT 'pending', "originalKey" character varying NOT NULL, "thumbnailKey" character varying, "mimeType" character varying NOT NULL, "fileSize" integer NOT NULL, "errorMessage" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "media"`);
        await queryRunner.query(`DROP TYPE "public"."media_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
