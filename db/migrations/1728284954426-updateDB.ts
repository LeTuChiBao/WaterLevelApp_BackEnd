import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateDB1728284954426 implements MigrationInterface {
    name = 'UpdateDB1728284954426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_sensor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "status" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, "name" varchar NOT NULL, "description" varchar NOT NULL, CONSTRAINT "FK_142466324a822b69d7ec75b7407" FOREIGN KEY ("regionId") REFERENCES "region" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_sensor"("id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId") SELECT "id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId" FROM "sensor"`);
        await queryRunner.query(`DROP TABLE "sensor"`);
        await queryRunner.query(`ALTER TABLE "temporary_sensor" RENAME TO "sensor"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sensor" RENAME TO "temporary_sensor"`);
        await queryRunner.query(`CREATE TABLE "sensor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "latitude" integer NOT NULL, "longitude" integer NOT NULL, "status" boolean NOT NULL DEFAULT (1), "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "regionId" integer, CONSTRAINT "FK_142466324a822b69d7ec75b7407" FOREIGN KEY ("regionId") REFERENCES "region" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "sensor"("id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId") SELECT "id", "latitude", "longitude", "status", "created_at", "updated_at", "regionId" FROM "temporary_sensor"`);
        await queryRunner.query(`DROP TABLE "temporary_sensor"`);
    }

}
