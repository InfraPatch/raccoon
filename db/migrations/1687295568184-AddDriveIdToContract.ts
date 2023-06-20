import {MigrationInterface, QueryRunner} from "typeorm";

export class AddDriveIdToContract1687295568184 implements MigrationInterface {
    name = 'AddDriveIdToContract1687295568184'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contracts\` CHANGE \`filename\` \`driveId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`driveId\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD \`driveId\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`driveId\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD \`driveId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`contracts\` CHANGE \`driveId\` \`filename\` varchar(255) NULL`);
    }

}
