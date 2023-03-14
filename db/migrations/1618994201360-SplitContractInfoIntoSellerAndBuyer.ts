import {MigrationInterface, QueryRunner} from "typeorm";

export class SplitContractInfoIntoSellerAndBuyer1618994201360 implements MigrationInterface {
    name = 'SplitContractInfoIntoSellerAndBuyer1618994201360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `filledAt`");
        await queryRunner.query("ALTER TABLE `contractOptions` ADD `isSeller` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `sellerSignedAt` timestamp NULL");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `buyerSignedAt` timestamp NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `buyerSignedAt`");
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `sellerSignedAt`");
        await queryRunner.query("ALTER TABLE `contractOptions` DROP COLUMN `isSeller`");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `filledAt` timestamp NULL");
    }

}
