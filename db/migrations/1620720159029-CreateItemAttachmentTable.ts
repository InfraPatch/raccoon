import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateItemAttachmentTable1620720159029 implements MigrationInterface {
    name = 'CreateItemAttachmentTable1620720159029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `filledItemAttachments` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `friendlyName` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `filledItemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `filledItemAttachments` ADD CONSTRAINT `FK_401de4f46d12ecd4bf87db46646` FOREIGN KEY (`filledItemId`) REFERENCES `filledItems`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `filledItemAttachments` DROP FOREIGN KEY `FK_401de4f46d12ecd4bf87db46646`");
        await queryRunner.query("DROP TABLE `filledItemAttachments`");
    }

}
