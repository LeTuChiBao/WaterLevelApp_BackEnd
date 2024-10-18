import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDB1728223373534 implements MigrationInterface {
    name = 'CreateDB1728223373534'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "role" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "notify" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "readingId" integer, "userId" integer)`);
        await queryRunner.query(`CREATE TABLE "reading" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "water_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer)`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "status" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer)`);
        await queryRunner.query(`CREATE TABLE "region" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "ward" varchar NOT NULL, "district" varchar NOT NULL, "damage_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "refresh_token" varchar, "avatar" varchar, "status" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_notify" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "readingId" integer, "userId" integer, CONSTRAINT "FK_615a5d170f5ee71fb68e3e96df0" FOREIGN KEY ("readingId") REFERENCES "reading" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_7e728820acd8818fe9638791bcf" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notify"("id", "message", "created_at", "readingId", "userId") SELECT "id", "message", "created_at", "readingId", "userId" FROM "notify"`);
        await queryRunner.query(`DROP TABLE "notify"`);
        await queryRunner.query(`ALTER TABLE "temporary_notify" RENAME TO "notify"`);
        await queryRunner.query(`CREATE TABLE "temporary_reading" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "water_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer, CONSTRAINT "FK_103bcd8d7cf4f83b25f13b29a61" FOREIGN KEY ("sensorId") REFERENCES "sensor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reading"("id", "water_level", "created_at", "sensorId") SELECT "id", "water_level", "created_at", "sensorId" FROM "reading"`);
        await queryRunner.query(`DROP TABLE "reading"`);
        await queryRunner.query(`ALTER TABLE "temporary_reading" RENAME TO "reading"`);
        await queryRunner.query(`CREATE TABLE "temporary_sensor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "status" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, CONSTRAINT "FK_142466324a822b69d7ec75b7407" FOREIGN KEY ("regionId") REFERENCES "region" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sensor"("id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId") SELECT "id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId" FROM "sensor"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`ALTER TABLE "temporary_sensor" RENAME TO "sensor"`);
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "refresh_token" varchar, "avatar" varchar, "status" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "FK_f1a2565b8f2580a146871cf1142" FOREIGN KEY ("regionId") REFERENCES "region" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_c28e52f758e7bbc53828db92194" FOREIGN KEY ("roleId") REFERENCES "role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "firstName", "lastName", "email", "password", "refresh_token", "avatar", "status", "created_at", "updated_at", "regionId", "roleId") SELECT "id", "firstName", "lastName", "email", "password", "refresh_token", "avatar", "status", "created_at", "updated_at", "regionId", "roleId" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "firstName" varchar NOT NULL, "lastName" varchar NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "refresh_token" varchar, "avatar" varchar, "status" integer NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, "roleId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "user"("id", "firstName", "lastName", "email", "password", "refresh_token", "avatar", "status", "created_at", "updated_at", "regionId", "roleId") SELECT "id", "firstName", "lastName", "email", "password", "refresh_token", "avatar", "status", "created_at", "updated_at", "regionId", "roleId" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
        await queryRunner.query(`ALTER TABLE "sensor" RENAME TO "temporary_sensor"`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "status" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer)`);
        await queryRunner.query(`INSERT INTO "sensor"("id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId") SELECT "id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId" FROM "temporary_sensor"`);
        await queryRunner.query(`DROP TABLE "temporary_sensor"`);
        await queryRunner.query(`ALTER TABLE "reading" RENAME TO "temporary_reading"`);
        await queryRunner.query(`CREATE TABLE "reading" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "water_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer)`);
        await queryRunner.query(`INSERT INTO "reading"("id", "water_level", "created_at", "sensorId") SELECT "id", "water_level", "created_at", "sensorId" FROM "temporary_reading"`);
        await queryRunner.query(`DROP TABLE "temporary_reading"`);
        await queryRunner.query(`ALTER TABLE "notify" RENAME TO "temporary_notify"`);
        await queryRunner.query(`CREATE TABLE "notify" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "readingId" integer, "userId" integer)`);
        await queryRunner.query(`INSERT INTO "notify"("id", "message", "created_at", "readingId", "userId") SELECT "id", "message", "created_at", "readingId", "userId" FROM "temporary_notify"`);
        await queryRunner.query(`DROP TABLE "temporary_notify"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "region"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`DROP TABLE "reading"`);
        await queryRunner.query(`DROP TABLE "notify"`);
        await queryRunner.query(`DROP TABLE "role"`);
    }

}
