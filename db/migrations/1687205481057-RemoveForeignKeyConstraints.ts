import {MigrationInterface, QueryRunner} from "typeorm";

export class RemoveForeignKeyConstraints1687205481057 implements MigrationInterface {
    name = 'RemoveForeignKeyConstraints1687205481057'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contractOptions\` DROP FOREIGN KEY \`FK_208bf304dda78757fb1f5de2f47\``);
        await queryRunner.query(`ALTER TABLE \`itemOptions\` DROP FOREIGN KEY \`FK_6f8f0d00c2f3c68f8a1664960fc\``);
        await queryRunner.query(`ALTER TABLE \`contracts\` DROP FOREIGN KEY \`FK_9d619e5e1e3520086d7b66760ba\``);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` DROP FOREIGN KEY \`FK_3b12288c661c2b8989eb3ba7bf3\``);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` DROP FOREIGN KEY \`FK_f40d8d6399028cb839890f56ccb\``);
        await queryRunner.query(`ALTER TABLE \`witnessSignatures\` DROP FOREIGN KEY \`FK_ec969389efc03d53575c5d5bcc1\``);
        await queryRunner.query(`ALTER TABLE \`filledContractAttachments\` DROP FOREIGN KEY \`FK_b4a0e6cd6a35419be82e33c7fe4\``);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` DROP FOREIGN KEY \`FK_01e432b331fcb60d3f5f0986b10\``);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` DROP FOREIGN KEY \`FK_9b5a115b2a63f688e9efb2482a1\``);
        await queryRunner.query(`ALTER TABLE \`filledItemAttachments\` DROP FOREIGN KEY \`FK_401de4f46d12ecd4bf87db46646\``);
        await queryRunner.query(`ALTER TABLE \`filledItems\` DROP FOREIGN KEY \`FK_cc50f5569de1d893e249a20253c\``);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` DROP FOREIGN KEY \`FK_2d4802ce9ae90c89429e290fa46\``);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` DROP FOREIGN KEY \`FK_6c8a3cead84341f329fc948c899\``);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` DROP FOREIGN KEY \`FK_59db7954910518be640faecaabd\``);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` DROP FOREIGN KEY \`FK_60aa69bc118d4585df413e777bf\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chatMessages\` ADD CONSTRAINT \`FK_60aa69bc118d4585df413e777bf\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` ADD CONSTRAINT \`FK_59db7954910518be640faecaabd\` FOREIGN KEY (\`filledContractId\`) REFERENCES \`filledContracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` ADD CONSTRAINT \`FK_6c8a3cead84341f329fc948c899\` FOREIGN KEY (\`filledItemId\`) REFERENCES \`filledItems\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledContracts\` ADD CONSTRAINT \`FK_2d4802ce9ae90c89429e290fa46\` FOREIGN KEY (\`contractId\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledItems\` ADD CONSTRAINT \`FK_cc50f5569de1d893e249a20253c\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledItemAttachments\` ADD CONSTRAINT \`FK_401de4f46d12ecd4bf87db46646\` FOREIGN KEY (\`filledItemId\`) REFERENCES \`filledItems\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` ADD CONSTRAINT \`FK_9b5a115b2a63f688e9efb2482a1\` FOREIGN KEY (\`optionId\`) REFERENCES \`itemOptions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledItemOptions\` ADD CONSTRAINT \`FK_01e432b331fcb60d3f5f0986b10\` FOREIGN KEY (\`filledItemId\`) REFERENCES \`filledItems\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledContractAttachments\` ADD CONSTRAINT \`FK_b4a0e6cd6a35419be82e33c7fe4\` FOREIGN KEY (\`filledContractId\`) REFERENCES \`filledContracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`witnessSignatures\` ADD CONSTRAINT \`FK_ec969389efc03d53575c5d5bcc1\` FOREIGN KEY (\`filledContractId\`) REFERENCES \`filledContracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` ADD CONSTRAINT \`FK_f40d8d6399028cb839890f56ccb\` FOREIGN KEY (\`filledContractId\`) REFERENCES \`filledContracts\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`filledContractOptions\` ADD CONSTRAINT \`FK_3b12288c661c2b8989eb3ba7bf3\` FOREIGN KEY (\`optionId\`) REFERENCES \`contractOptions\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contracts\` ADD CONSTRAINT \`FK_9d619e5e1e3520086d7b66760ba\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`itemOptions\` ADD CONSTRAINT \`FK_6f8f0d00c2f3c68f8a1664960fc\` FOREIGN KEY (\`itemId\`) REFERENCES \`items\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`contractOptions\` ADD CONSTRAINT \`FK_208bf304dda78757fb1f5de2f47\` FOREIGN KEY (\`contractId\`) REFERENCES \`contracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
