import { spawn } from 'child_process';

import * as fs from 'fs';
import tempy from 'tempy';

// TODO: remove unoconv dependency
const UNOCONV_ARGS = [ '--stdout', '-f', 'pdf' ];

class PDFService {
  private prepare(buffer: Buffer): string {
    const filepath = tempy.file();
    fs.writeFileSync(filepath, buffer);
    return filepath;
  }

  private cleanup(filepath: string) {
    fs.unlinkSync(filepath);
  }

  private async convertDocxToPdf(filepath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const child = spawn('unoconv', [ ...UNOCONV_ARGS, filepath ]);

      const stdout = [];
      const stderr = [];

      child.on('error', err => {
        return reject(err);
      });

      child.stdout.on('data', data => stdout.push(data));
      child.stderr.on('data', data => stderr.push(data));

      child.on('exit', () => {
        if (stderr.length) {
          return reject(Buffer.concat(stderr).toString('utf8'));
        }

        return resolve(Buffer.concat(stdout));
      });
    });
  }

  async create(docx: Buffer): Promise<Buffer> {
    const filepath = this.prepare(docx);

    try {
      const pdf = await this.convertDocxToPdf(filepath);

      // sign with P12 certificate

      return pdf;
    } catch (err) {
      throw err;
    } finally {
      this.cleanup(filepath);
    }
  }
}

const pdfService = new PDFService();
export default pdfService;
