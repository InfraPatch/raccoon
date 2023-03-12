import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsAdminFieldToUsersTable1618846114753 implements MigrationInterface {
    name = 'AddIsAdminFieldToUsersTable1618846114753'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `isAdmin` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `isAdmin`");
    }

}
