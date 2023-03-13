import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeUserIdentificationFieldsNullable1618919819281 implements MigrationInterface {
    name = 'MakeUserIdentificationFieldsNullable1618919819281'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `password` `password` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `motherName` `motherName` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `motherBirthDate` `motherBirthDate` timestamp(6) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `nationality` `nationality` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `personalIdentifier` `personalIdentifier` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `phoneNumber` `phoneNumber` varchar(255) NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `birthDate` `birthDate` timestamp(6) NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `users` CHANGE `birthDate` `birthDate` timestamp(6) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `phoneNumber` `phoneNumber` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `personalIdentifier` `personalIdentifier` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `nationality` `nationality` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `motherBirthDate` `motherBirthDate` timestamp(6) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `motherName` `motherName` varchar(255) NOT NULL");
        await queryRunner.query("ALTER TABLE `users` CHANGE `password` `password` varchar(255) NOT NULL");
    }

}
