import {MigrationInterface, QueryRunner} from "typeorm";

export class AddIsLawyerFieldToUsersTable1620484105553 implements MigrationInterface {
    name = 'AddIsLawyerFieldToUsersTable1620484105553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` ADD `isLawyer` tinyint NOT NULL DEFAULT 0");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` DROP COLUMN `isLawyer`");
    }
}
