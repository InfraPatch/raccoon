import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLockedFieldToFilledItems1620815509854 implements MigrationInterface {
    name = 'AddLockedFieldToFilledItems1620815509854'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledItems` ADD `locked` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledItems` DROP COLUMN `locked`");
    }

}
