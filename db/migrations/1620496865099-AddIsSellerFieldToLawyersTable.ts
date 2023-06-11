import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsSellerFieldToLawyersTable1620496865099
  implements MigrationInterface
{
  name = 'AddIsSellerFieldToLawyersTable1620496865099';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `witnessSignatures` ADD `isSeller` tinyint NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `witnessSignatures` DROP COLUMN `isSeller`',
    );
  }
}
