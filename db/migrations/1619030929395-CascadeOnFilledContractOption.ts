import {MigrationInterface, QueryRunner} from "typeorm";

export class CascadeOnFilledContractOption1619030929395 implements MigrationInterface {
    name = 'CascadeOnFilledContractOption1619030929395'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_3b12288c661c2b8989eb3ba7bf3`");
        await queryRunner.query("ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_3b12288c661c2b8989eb3ba7bf3` FOREIGN KEY (`optionId`) REFERENCES `contractOptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_3b12288c661c2b8989eb3ba7bf3`");
        await queryRunner.query("ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_3b12288c661c2b8989eb3ba7bf3` FOREIGN KEY (`optionId`) REFERENCES `contractOptions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

}
