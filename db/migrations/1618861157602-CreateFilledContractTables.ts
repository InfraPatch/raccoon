import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateFilledContractTables1618861157602
  implements MigrationInterface
{
  name = 'CreateFilledContractTables1618861157602';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `filledContractOptions` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `value` varchar(255) NOT NULL, `filledContractId` int NULL, `optionId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE `filledContracts` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `userId` int NOT NULL, `filledAt` timestamp NULL, `contractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_f40d8d6399028cb839890f56ccb` FOREIGN KEY (`filledContractId`) REFERENCES `filledContracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` ADD CONSTRAINT `FK_3b12288c661c2b8989eb3ba7bf3` FOREIGN KEY (`optionId`) REFERENCES `contractOptions`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContracts` ADD CONSTRAINT `FK_2d4802ce9ae90c89429e290fa46` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` DROP FOREIGN KEY `FK_2d4802ce9ae90c89429e290fa46`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_3b12288c661c2b8989eb3ba7bf3`',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` DROP FOREIGN KEY `FK_f40d8d6399028cb839890f56ccb`',
    );
    await queryRunner.query('DROP TABLE `filledContracts`');
    await queryRunner.query('DROP TABLE `filledContractOptions`');
  }
}
