
import config from '@/config';

import * as fs from 'fs';
import * as path from 'path';

import { IPDFAttachment } from './pdf';

import { formatDate } from '@/lib/formatDate';
import { jsonToXml } from '@/lib/objectToXml';

import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { sign } from 'pdf-signer';
import { v4 as uuid } from 'uuid';
import { omit } from 'lodash';

// The color that all attestation fields are set to, currently dark red.
const ATTESTATION_COLOR = rgb(0.75, 0, 0);

// The font size that all attestation fields are set to.
const ATTESTATION_FONT_SIZE = 11;

// File paths pointing to the AVDH signature keys.
const AVDH_KEY_PATH = '.avdh/key.p12';
const AVDH_PASSWORD_PATH = '.avdh/pass.txt';

const AvdhConfig = config.avdh;

const getKey = () : Buffer => {
  const keyFilepath = path.join(process.cwd(), AVDH_KEY_PATH);

  if (fs.existsSync(keyFilepath)) {
    return fs.readFileSync(keyFilepath);
  }

  const base64Key = AvdhConfig?.key;

  if (base64Key) {
    return Buffer.from(base64Key, 'base64');
  }

  return null;
};

const getPassword = () : string => {
  const passFilepath = path.join(process.cwd(), AVDH_PASSWORD_PATH);

  if (fs.existsSync(passFilepath)) {
    return fs.readFileSync(passFilepath).toString();
  }

  const password = AvdhConfig?.password;

  if (password) {
    return password;
  }

  return null;
};

export interface IAVDHAttestation {
  date: Date;
  fullName: string;
  birthName: string;
  birthPlace: string;
  birthDate: string;
  motherName: string;
  signature: Buffer;
  email?: string;
}

interface IAttestationField {
  text: string;
  x: number;
  y: number;
}

class AVDHService {
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

      if (attestation.signature) {
        const signatureImage = await pdfDoc.embedPng(attestation.signature);

        try {
          page.drawImage(signatureImage, {x: 335, y: 155, width: 200, height: 100});
        } catch {
          // Don't trust user-provided signatures.
          // If pdf-lib can't parse the signature, don't include it
        }
      }

      for (const field of fields) {
        page.drawText(field.text || "", {
          x: field.x,
          y: field.y,
          font: helveticaFont,
          size: ATTESTATION_FONT_SIZE,
          color: ATTESTATION_COLOR
        });
      }

      const pdfBytes = Buffer.from(await pdfDoc.save({ useObjectStreams: false }));
      return resolve(pdfBytes);
    });
  }

  async createAVDHAttachments(attestations: IAVDHAttestation[]) : Promise<IPDFAttachment[]> {
    return new Promise(async (resolve, _) => {
      const attachments : IPDFAttachment[] = [];

      for (const attestation of attestations) {
        const avdhBytes : Buffer = await this.createAVDHAttachment(attestation);
        const avdhXml : Buffer = Buffer.from(jsonToXml(omit({ ...attestation, date: attestation.date.toISOString() }, 'signature')));
        const avdhUuid : string = uuid();

        attachments.push({
          file: avdhBytes,
          filename: `avdh-${avdhUuid}.pdf`,
          description: `AVDH Attestation of ${attestation.fullName}`,
          creationDate: attestation.date
        });

        attachments.push({
          file: avdhXml,
          filename: `avdh-${avdhUuid}.xml`,
          description: `AVDH Attestation of ${attestation.fullName}`,
          creationDate: attestation.date
        });
      }

      return resolve(attachments);
    });
  }

  async addSignature(pdfBytes: Buffer, attestation: IAVDHAttestation) : Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const key : Buffer = getKey();

      if (!key) {
        return reject(`AVDH signature key has not been specified. Please create the file '${AVDH_KEY_PATH}' or set AVDH_KEY_BASE64 in the .env file.`);
      }

      const password : string = getPassword();

      if (!password) {
        return reject(`AVDH signature password has not been specified. Please create the file '${AVDH_PASSWORD_PATH}' or set AVDH_KEY_PASSWORD in the .env file.`);
      }

      const signedBytes = await sign(pdfBytes, key, password, {
        reason: '2',
        email: attestation.email,
        location: attestation.birthPlace,
        signerName: attestation.fullName,
        annotationAppearanceOptions: {
          signatureCoordinates: { left: 704, bottom: 700, right: 437, top: 800 },
          signatureDetails: [],
          imageDetails: {
            imagePath: './assets/avdh/avdh_logo.png',
            transformOptions: { rotate: 0, space: 125, stretch: 40, tilt: 0, xPos: 0, yPos: 25 },
          }
        }
      });

      return resolve(signedBytes);
    });
  }
}

export const avdhService : AVDHService = new AVDHService();
