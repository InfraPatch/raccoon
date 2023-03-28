import { spawn } from 'child_process';

import * as fs from 'fs';
import tempy from 'tempy';
import path from 'path';

// TODO: remove libreoffice dependency
const SOFFICE_ARGS = [ '--headless', '--convert-to', 'pdf' ];

class PDFService {
  private prepare(buffer: Buffer): string {
    const filepath = tempy.file();
    fs.writeFileSync(filepath, buffer);
    return filepath;
  }

  private cleanup(filepath: string) {
    fs.unlinkSync(filepath);
  }

  private async getLibreOfficePath(): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let paths : string[] = [];

      switch (process.platform) {
        case 'darwin':
          paths = ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];
          break;
        case 'linux':
          paths = ['/usr/bin/libreoffice', '/usr/bin/soffice'];
          break;
        case 'win32':
          paths = [
            path.join(process.env['PROGRAMFILES(X86)'], 'LIBREO~1/program/soffice.exe'),
            path.join(process.env['PROGRAMFILES(X86)'], 'LibreOffice/program/soffice.exe'),
            path.join(process.env.PROGRAMFILES, 'LibreOffice/program/soffice.exe'),
          ];
          break;
        default:
          return reject(`Operating system not yet supported: ${process.platform}`);
      }

      for (let i = 0; i < paths.length; ++i) {
        const path : string = paths[i];

        try {
          await fs.promises.access(path, fs.constants.R_OK);
          return resolve(path);
        } catch {
          // Cannot access this path.
        }
      }

      return reject("Could not find LibreOffice, are you sure you've installed LibreOffice?");
    });
  }

  private async convertDocxToPdf(filepath: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      let officePath : string;

      try {
        officePath = await this.getLibreOfficePath();
      } catch (err) {
        officePath = 'soffice';
      }

      const child = spawn(officePath, [ ...SOFFICE_ARGS, filepath, '-outdir', path.dirname(filepath) ]);

      child.on('error', err => {
        if ((err as any).code === 'ENOENT') {
          return reject("Could not find LibreOffice, are you sure you've installed LibreOffice?");
        }

        return reject(err);
      });

      child.on('exit', () => {
        const outputPath : string = `${filepath}.pdf`;
        let output : Buffer;

        try {
          output = fs.readFileSync(outputPath);
        } catch {
          return reject('Could not convert document, LibreOffice refused to convert!');
        }

        fs.unlinkSync(outputPath);

        if (output.length === 0) {
          return reject('Could not convert document, converted document empty!');
        }

        return resolve(output);
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
