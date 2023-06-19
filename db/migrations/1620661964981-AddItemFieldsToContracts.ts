import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddItemFieldsToContracts1620661964981
  implements MigrationInterface
{
  name = 'AddItemFieldsToContracts1620661964981';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `contracts` ADD `itemId` int NULL');
    await queryRunner.query(
      'ALTER TABLE `filledContracts` ADD `filledItemId` int NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `filledContracts` DROP COLUMN `filledItemId`',
    );
    await queryRunner.query('ALTER TABLE `contracts` DROP COLUMN `itemId`');
  }
}
