import {MigrationInterface, QueryRunner} from "typeorm";

export class AddItemFieldsToContracts1620661964981 implements MigrationInterface {
    name = 'AddItemFieldsToContracts1620661964981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contracts` ADD `itemId` int NULL");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `filledItemId` int NULL");
        await queryRunner.query("ALTER TABLE `contracts` ADD CONSTRAINT `FK_9d619e5e1e3520086d7b66760ba` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD CONSTRAINT `FK_6c8a3cead84341f329fc948c899` FOREIGN KEY (`filledItemId`) REFERENCES `filledItems`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContracts` DROP FOREIGN KEY `FK_6c8a3cead84341f329fc948c899`");
        await queryRunner.query("ALTER TABLE `contracts` DROP FOREIGN KEY `FK_9d619e5e1e3520086d7b66760ba`");
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `filledItemId`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `itemId`");
    }

}
