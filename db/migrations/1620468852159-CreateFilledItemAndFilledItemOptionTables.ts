import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilledItemAndFilledItemOptionTables1620468852159
  implements MigrationInterface
{
  name = 'CreateFilledItemAndFilledItemOptionTables1620468852159';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `filledItemOptions` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `value` varchar(255) NULL, `filledItemId` int NULL, `optionId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `filledItems` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `friendlyName` varchar(255) NOT NULL, `userId` int NOT NULL, `itemId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `filledItemOptions` ADD CONSTRAINT `FK_01e432b331fcb60d3f5f0986b10` FOREIGN KEY (`filledItemId`) REFERENCES `filledItems`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `filledItemOptions` ADD CONSTRAINT `FK_9b5a115b2a63f688e9efb2482a1` FOREIGN KEY (`optionId`) REFERENCES `itemOptions`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `filledItems` ADD CONSTRAINT `FK_cc50f5569de1d893e249a20253c` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledItems` DROP FOREIGN KEY `FK_cc50f5569de1d893e249a20253c`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledItemOptions` DROP FOREIGN KEY `FK_9b5a115b2a63f688e9efb2482a1`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledItemOptions` DROP FOREIGN KEY `FK_01e432b331fcb60d3f5f0986b10`',
    );
    await queryRunner.query('DROP TABLE `filledItems`');
    await queryRunner.query('DROP TABLE `filledItemOptions`');
  }
}
