import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeFillContractOptionValueNullable1619103618137
  implements MigrationInterface
{
  name = 'MakeFillContractOptionValueNullable1619103618137';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` CHANGE `value` `value` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContractOptions` CHANGE `value` `value` varchar(255) NOT NULL',
    );
  }
}
