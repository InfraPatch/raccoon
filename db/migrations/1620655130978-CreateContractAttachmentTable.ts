import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateContractAttachmentTable1620655130978
  implements MigrationInterface
{
  name = 'CreateContractAttachmentTable1620655130978';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `filledContractAttachments` (`id` int NOT NULL AUTO_INCREMENT, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `friendlyName` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `isSeller` tinyint NOT NULL, `filledContractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `filledContractAttachments` ADD CONSTRAINT `FK_b4a0e6cd6a35419be82e33c7fe4` FOREIGN KEY (`filledContractId`) REFERENCES `filledContracts`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContractAttachments` DROP FOREIGN KEY `FK_b4a0e6cd6a35419be82e33c7fe4`',
    );
    await queryRunner.query('DROP TABLE `filledContractAttachments`');
  }
}
