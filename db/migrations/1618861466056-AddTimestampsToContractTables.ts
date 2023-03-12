import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTimestampsToContractTables1618861466056 implements MigrationInterface {
    name = 'AddTimestampsToContractTables1618861466056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contractFiles` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `contractFiles` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `contractOptions` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `contractOptions` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `contracts` ADD `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)");
        await queryRunner.query("ALTER TABLE `contracts` ADD `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `contractOptions` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `contractOptions` DROP COLUMN `createdAt`");
        await queryRunner.query("ALTER TABLE `contractFiles` DROP COLUMN `updatedAt`");
        await queryRunner.query("ALTER TABLE `contractFiles` DROP COLUMN `createdAt`");
    }

}
