import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateReadingColumUpdateAt1728292267653 implements MigrationInterface {
    name = 'UpdateReadingColumUpdateAt1728292267653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_reading" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "water_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer, "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_103bcd8d7cf4f83b25f13b29a61" FOREIGN KEY ("sensorId") REFERENCES "sensor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_reading"("id", "water_level", "created_at", "sensorId") SELECT "id", "water_level", "created_at", "sensorId" FROM "reading"`);
        await queryRunner.query(`DROP TABLE "reading"`);
        await queryRunner.query(`ALTER TABLE "temporary_reading" RENAME TO "reading"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reading" RENAME TO "temporary_reading"`);
        await queryRunner.query(`CREATE TABLE "reading" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "water_level" float NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "sensorId" integer, CONSTRAINT "FK_103bcd8d7cf4f83b25f13b29a61" FOREIGN KEY ("sensorId") REFERENCES "sensor" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "reading"("id", "water_level", "created_at", "sensorId") SELECT "id", "water_level", "created_at", "sensorId" FROM "temporary_reading"`);
        await queryRunner.query(`DROP TABLE "temporary_reading"`);
    }

}
