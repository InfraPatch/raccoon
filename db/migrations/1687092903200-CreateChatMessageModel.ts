import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateChatMessageModel1687092903200 implements MigrationInterface {
    name = 'CreateChatMessageModel1687092903200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`chatMessages\` (\`uuid\` varchar(36) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`message\` varchar(255) NOT NULL, \`userId\` int NULL, \`filledContractId\` int NULL, PRIMARY KEY (\`uuid\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` ADD CONSTRAINT \`FK_60aa69bc118d4585df413e777bf\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` ADD CONSTRAINT \`FK_59db7954910518be640faecaabd\` FOREIGN KEY (\`filledContractId\`) REFERENCES \`filledContracts\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`chatMessages\` DROP FOREIGN KEY \`FK_59db7954910518be640faecaabd\``);
        await queryRunner.query(`ALTER TABLE \`chatMessages\` DROP FOREIGN KEY \`FK_60aa69bc118d4585df413e777bf\``);
        await queryRunner.query(`DROP TABLE \`chatMessages\``);
    }

}
