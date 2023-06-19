import {MigrationInterface, QueryRunner} from "typeorm";

export class SoftDeletableModels1687189661852 implements MigrationInterface {
    name = 'SoftDeletableModels1687189661852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contractOptions\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`itemOptions\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`items\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`witnessSignatures\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledContractAttachments\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledItemAttachments\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledItems\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` ADD \`deletedAt\` datetime(6) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chatMessages\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledItems\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledItemAttachments\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledContractAttachments\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`witnessSignatures\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`items\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`itemOptions\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`contractOptions\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`deletedAt\``);
    }

}
