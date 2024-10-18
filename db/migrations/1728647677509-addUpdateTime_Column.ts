import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUpdateTimeColumn1728647677509 implements MigrationInterface {
    name = 'AddUpdateTimeColumn1728647677509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_notify" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "readingId" integer, "userId" integer, "isReading" boolean NOT NULL DEFAULT (0), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_7e728820acd8818fe9638791bcf" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_615a5d170f5ee71fb68e3e96df0" FOREIGN KEY ("readingId") REFERENCES "reading" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_notify"("id", "message", "created_at", "readingId", "userId", "isReading") SELECT "id", "message", "created_at", "readingId", "userId", "isReading" FROM "notify"`);
        await queryRunner.query(`DROP TABLE "notify"`);
        await queryRunner.query(`ALTER TABLE "temporary_notify" RENAME TO "notify"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notify" RENAME TO "temporary_notify"`);
        await queryRunner.query(`CREATE TABLE "notify" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "message" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "readingId" integer, "userId" integer, "isReading" boolean NOT NULL DEFAULT (0), CONSTRAINT "FK_7e728820acd8818fe9638791bcf" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_615a5d170f5ee71fb68e3e96df0" FOREIGN KEY ("readingId") REFERENCES "reading" ("id") ON DELETE CASCADE ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "notify"("id", "message", "created_at", "readingId", "userId", "isReading") SELECT "id", "message", "created_at", "readingId", "userId", "isReading" FROM "temporary_notify"`);
        await queryRunner.query(`DROP TABLE "temporary_notify"`);
    }

}
