import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateItemAndItemOptionTables1620467518043
  implements MigrationInterface
{
  name = 'CreateItemAndItemOptionTables1620467518043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `itemOptions` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `type` enum ('0', '1', '2', '3', '4', '5', '6', '7', '8') NOT NULL DEFAULT '0', `priority` int NOT NULL, `friendlyName` varchar(255) NOT NULL, `longDescription` varchar(255) NULL, `hint` varchar(255) NULL, `replacementString` varchar(255) NOT NULL, `minimumValue` int NULL, `maximumValue` int NULL, `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      'CREATE TABLE `items` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `friendlyName` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `itemOptions` ADD CONSTRAINT `FK_6f8f0d00c2f3c68f8a1664960fc` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `itemOptions` DROP FOREIGN KEY `FK_6f8f0d00c2f3c68f8a1664960fc`',
    );
    await queryRunner.query('DROP TABLE `items`');
    await queryRunner.query('DROP TABLE `itemOptions`');
  }
}
