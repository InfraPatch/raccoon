import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordFieldToUsersTable1618678361775
  implements MigrationInterface
{
  name = 'AddPasswordFieldToUsersTable1618678361775';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `users` ADD `password` varchar(255) NOT NULL',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `users` DROP COLUMN `password`');
  }
}
