import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialSchema1773436902075 implements MigrationInterface {
    name = 'CreateInitialSchema1773436902075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "lost_pets" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "species" character varying(100) NOT NULL, "breed" character varying(100) NOT NULL, "color" character varying(100) NOT NULL, "size" character varying(50) NOT NULL, "description" text NOT NULL, "photo_url" character varying(500), "owner_name" character varying(255) NOT NULL, "owner_email" character varying(255) NOT NULL, "owner_phone" character varying(30) NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying(255) NOT NULL, "lost_date" TIMESTAMP NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4ba852a354b48000bcb3faaaea5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "found_pets" ("id" SERIAL NOT NULL, "species" character varying(100) NOT NULL, "breed" character varying(100), "color" character varying(100) NOT NULL, "size" character varying(50) NOT NULL, "description" text NOT NULL, "photo_url" character varying(500), "finder_name" character varying(255) NOT NULL, "finder_email" character varying(255) NOT NULL, "finder_phone" character varying(30) NOT NULL, "location" geometry(Point,4326) NOT NULL, "address" character varying(255) NOT NULL, "found_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1e8aeb0b37dd97bfce972552b8d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "found_pets"`);
        await queryRunner.query(`DROP TABLE "lost_pets"`);
    }

}
