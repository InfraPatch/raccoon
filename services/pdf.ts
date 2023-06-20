import { IAVDHAttestation, avdhService } from '@/services/avdh';
import { PDFDocument } from 'pdf-lib';

import mime from 'mime-types';

export interface IPDFAttachment {
  file: Buffer;
  filename: string;
  description: string;
  creationDate: Date;
}

class PDFService {
  async addAttachments(
    pdf: Buffer,
    attachments: IPDFAttachment[],
  ): Promise<Buffer> {
    if (!attachments) {
      // No attachments are to be added to this file.
      return pdf;
    }

    const pdfDoc = await PDFDocument.load(pdf);

    for (const attachment of attachments) {
      await pdfDoc.attach(attachment.file, attachment.filename, {
        mimeType:
          mime.lookup(attachment.filename) || 'application/octet-stream',
        description: attachment.description,
        creationDate: attachment.creationDate,
        modificationDate: attachment.creationDate,
      });
    }

    return Buffer.from(await pdfDoc.save({ useObjectStreams: false }));
  }

  async create(
    pdf: Buffer,
    attachments: IPDFAttachment[],
    attestations: IAVDHAttestation[],
  ): Promise<Buffer> {
    try {
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
    }
  }
}

export const pdfService = new PDFService();
