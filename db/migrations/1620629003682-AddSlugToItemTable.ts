import {MigrationInterface, QueryRunner} from "typeorm";

export class AddSlugToItemTable1620629003682 implements MigrationInterface {
    name = 'AddSlugToItemTable1620629003682'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `items` ADD `slug` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `items` ADD UNIQUE INDEX `IDX_a30421de0f1836d3e4a8071b2a` (`slug`)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `items` DROP INDEX `IDX_a30421de0f1836d3e4a8071b2a`");
        await queryRunner.query("ALTER TABLE `items` DROP COLUMN `slug`");
    }

}
