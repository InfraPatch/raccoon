import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBirthPlaceFieldToUsersTable1619084955296
  implements MigrationInterface
{
  name = 'AddBirthPlaceFieldToUsersTable1619084955296';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `birthPlace` varchar(255) NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `birthPlace`');
  }
}
