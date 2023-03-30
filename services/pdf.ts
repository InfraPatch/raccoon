import { formatDate } from '@/lib/formatDate';
import { spawn } from 'child_process';

import * as fs from 'fs';
import tempy from 'tempy';
import path from 'path';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { v4 as uuid } from 'uuid';
import { jsonToXml } from '@/lib/objectToXml';

// TODO: remove libreoffice dependency
const SOFFICE_ARGS = [ '--headless', '--convert-to', 'pdf' ];

// The color that all attestation fields are set to, currently dark red.
const ATTESTATION_COLOR = rgb(0.75, 0, 0);

// The font size that all attestation fields are set to.
const ATTESTATION_FONT_SIZE = 11;

export interface IAVDHAttestation {
  date: Date;
  fullName: string;
  birthName: string;
  birthPlace: string;
  birthDate: string;
  motherName: string;
}

interface IAttestationField {
  text: string;
  x: number,
  y: number
}

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

  async createAVDHAttachment(attestation: IAVDHAttestation): Promise<Buffer> {
    return new Promise(async (resolve, _) => {
      const formBytes = fs.readFileSync('assets/avdh/avdh_form.pdf');
      const pdfDoc = await PDFDocument.load(formBytes);

      const pages = pdfDoc.getPages();
      const page = pages[0];

      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const fields : IAttestationField[] = [
        {
          text: attestation.fullName,
          x: 123, y: 261
        },
        {
          text: formatDate(attestation.date, false),
          x: 185, y: 232
        },
        {
          text: attestation.birthName,
          x: 160, y: 189
        },
        {
          text: attestation.birthPlace,
          x: 160, y: 174
        },
        {
          text: attestation.birthDate,
          x: 160, y: 159
        },
        {
          text: attestation.motherName,
          x: 160, y: 144
        }
      ];

      for (const field of fields) {
        page.drawText(field.text, {
          x: field.x,
          y: field.y,
          font: helveticaFont,
          size: ATTESTATION_FONT_SIZE,
          color: ATTESTATION_COLOR
        });
      }

      const pdfBytes = await pdfDoc.save();
      return resolve(pdfBytes);
    });
  }

  async addAVDHAttachments(pdfBytes: Buffer, attestations: IAVDHAttestation[]) : Promise<Buffer> {
    return new Promise(async (resolve, _) => {
      const pdfDoc = await PDFDocument.load(pdfBytes);

      for (const attestation of attestations) {
        const avdhBytes : Buffer = await this.createAVDHAttachment(attestation);
        const avdhXml : Buffer = Buffer.from(jsonToXml({ ...attestation, date: formatDate(attestation.date, false) }));
        const avdhUuid : string = uuid();

        await pdfDoc.attach(avdhBytes, `avdh-${avdhUuid}.pdf`, {
          mimeType: 'application/pdf',
          description: `AVDH Attestation of ${attestation.fullName}`,
          creationDate: attestation.date,
          modificationDate: attestation.date
        });

        await pdfDoc.attach(avdhXml, `avdh-${avdhUuid}.xml`, {
          mimeType: 'application/xml',
          description: `AVDH Attestation XML of ${attestation.fullName}`,
          creationDate: attestation.date,
          modificationDate: attestation.date
        });
      }

      const outputPdfBytes = await pdfDoc.save();
      return resolve(outputPdfBytes);
    });
  }

  async create(docx: Buffer, attestations: IAVDHAttestation[]): Promise<Buffer> {
    const filepath = this.prepare(docx);

    try {
      const pdf = await this.convertDocxToPdf(filepath);
      const attestedPdf = await this.addAVDHAttachments(pdf, attestations);

      return attestedPdf;
    } catch (err) {
      throw err;
    } finally {
      this.cleanup(filepath);
    }
  }
}

export const pdfService = new PDFService();
