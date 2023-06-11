import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeContractFilenameNullable1619018067079
  implements MigrationInterface
{
  name = 'MakeContractFilenameNullable1619018067079';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contracts` CHANGE `filename` `filename` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `contracts` CHANGE `filename` `filename` varchar(255) NOT NULL',
    );
  }
}
