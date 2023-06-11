import { spawn } from 'child_process';

import * as fs from 'fs';
import { temporaryFile } from 'tempy';
import path from 'path';

import { IAVDHAttestation, avdhService } from '@/services/avdh';
import { PDFDocument } from 'pdf-lib';

import mime from 'mime-types';

// TODO: remove libreoffice dependency
// Daniel: actually, let's keep it.
const SOFFICE_ARGS = ['--headless', '--convert-to', 'pdf'];

export interface IPDFAttachment {
  file: Buffer;
  filename: string;
  description: string;
  creationDate: Date;
}

class PDFService {
  private prepare(buffer: Buffer): string {
    const filepath = temporaryFile();
    fs.writeFileSync(filepath, buffer);
    return filepath;
  }

  private cleanup(filepath: string) {
    fs.unlinkSync(filepath);
  }

  private getLibreOfficePath(): string {
    let paths: string[] = [];

    switch (process.platform) {
      case 'darwin':
        paths = ['/Applications/LibreOffice.app/Contents/MacOS/soffice'];
        break;
      case 'linux':
        paths = ['/usr/bin/libreoffice', '/usr/bin/soffice'];
        break;
      case 'win32':
        paths = [
          path.join(
            process.env['PROGRAMFILES(X86)'],
            'LIBREO~1/program/soffice.exe',
          ),
          path.join(
            process.env['PROGRAMFILES(X86)'],
            'LibreOffice/program/soffice.exe',
          ),
          path.join(
            process.env.PROGRAMFILES,
            'LibreOffice/program/soffice.exe',
          ),
        ];
        break;
      default:
        throw new Error(
          `Operating system not yet supported: ${process.platform}`,
        );
    }

    for (let i = 0; i < paths.length; ++i) {
      const path: string = paths[i];

      try {
        fs.accessSync(path, fs.constants.R_OK);
        return path;
      } catch {
        // Cannot access this path.
      }
    }

    throw new Error(
      "Could not find LibreOffice, are you sure you've installed LibreOffice?",
    );
  }

  private async convertDocxToPdf(filepath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      let officePath: string;

      try {
        officePath = this.getLibreOfficePath();
      } catch (err) {
        officePath = 'soffice';
      }

      const child = spawn(officePath, [
        ...SOFFICE_ARGS,
        filepath,
        '-outdir',
        path.dirname(filepath),
      ]);

      child.on('error', (err) => {
        if ((err as any).code === 'ENOENT') {
          return reject(
            "Could not find LibreOffice, are you sure you've installed LibreOffice?",
          );
        }

        return reject(err);
      });

      child.on('exit', () => {
        const outputPath = `${filepath}.pdf`;
        let output: Buffer;

        try {
          output = fs.readFileSync(outputPath);
        } catch {
          return reject(
            'Could not convert document, LibreOffice refused to convert!',
          );
        }

        fs.unlinkSync(outputPath);

        if (output.length === 0) {
          return reject(
            'Could not convert document, converted document empty!',
          );
        }

        return resolve(output);
      });
    });
  }

  async addAttachments(
    pdfBytes: Buffer,
    attachments: IPDFAttachment[],
  ): Promise<Buffer> {
    if (!attachments) {
      // No attachments are to be added to this file.
      return pdfBytes;
    }

    const pdfDoc = await PDFDocument.load(pdfBytes);

    for (const attachment of attachments) {
      await pdfDoc.attach(attachment.file, attachment.filename, {
        mimeType:
          mime.lookup(attachment.filename) || 'application/octet-stream',
        description: attachment.description,
        creationDate: attachment.creationDate,
        modificationDate: attachment.creationDate,
      });
    }

    const outputPdfBytes = Buffer.from(
      await pdfDoc.save({ useObjectStreams: false }),
    );
    return outputPdfBytes;
  }

  async create(
    docx: Buffer,
    attachments: IPDFAttachment[],
    attestations: IAVDHAttestation[],
  ): Promise<Buffer> {
    const filepath = this.prepare(docx);

    try {
      const pdf = await this.convertDocxToPdf(filepath);
      const avdhAttachments = await avdhService.createAVDHAttachments(
        attestations,
      );

      const allAttachments = attachments.concat(avdhAttachments);
      const attestedPdf = await this.addAttachments(pdf, allAttachments);

      if (attestations.length === 0) {
        // No attestations are available, so we won't be signing this document.
        return attestedPdf;
      }

      // We're going to sign the PDF itself on behalf of the seller.
      try {
        const signedPdf = await avdhService.addSignature(
          attestedPdf,
          attestations[0],
        );
        return signedPdf;
      } catch (err) {
        console.log(err);
        return attestedPdf;
      }
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      this.cleanup(filepath);
    }
  }
}

export const pdfService = new PDFService();
