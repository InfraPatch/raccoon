import {MigrationInterface, QueryRunner} from "typeorm";

export class OnlyOneFilePerContract1618995992876 implements MigrationInterface {
    name = 'OnlyOneFilePerContract1618995992876'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `contracts` ADD `filename` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `buyerId` int NOT NULL");
        await queryRunner.query("ALTER TABLE `filledContracts` ADD `accepted` tinyint NOT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `accepted`");
        await queryRunner.query("ALTER TABLE `filledContracts` DROP COLUMN `buyerId`");
        await queryRunner.query("ALTER TABLE `contracts` DROP COLUMN `filename`");
    }

}
