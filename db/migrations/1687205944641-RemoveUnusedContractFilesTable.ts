import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedContractFilesTable1687205944641
  implements MigrationInterface
{
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `contractFiles` (`id` int NOT NULL AUTO_INCREMENT, `friendlyName` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `contractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'ALTER TABLE `contractFiles` ADD CONSTRAINT `FK_4ad73d5e9c4b70e88189f6c5ee6` FOREIGN KEY (`contractId`) REFERENCES `contracts`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contractFiles` DROP FOREIGN KEY `FK_4ad73d5e9c4b70e88189f6c5ee6`',
    );
    await queryRunner.query('DROP TABLE `contractFiles`');
  }
}
