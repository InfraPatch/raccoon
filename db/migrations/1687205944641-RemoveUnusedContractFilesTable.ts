import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveUnusedContractFilesTable1687205944641
  implements MigrationInterface
{
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `contractFiles` (`id` int NOT NULL AUTO_INCREMENT, `friendlyName` varchar(255) NOT NULL, `filename` varchar(255) NOT NULL, `contractId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `contractFiles`');
  }
}
