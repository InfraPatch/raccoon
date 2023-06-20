import config from '@/config';
import { google } from 'googleapis';

const getGoogleAuth = () => {
  const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/documents',
  ];

  const auth = new google.auth.GoogleAuth({
    scopes: SCOPES,
    credentials: {
      client_email: config.google.clientEmail,
      private_key: config.google.privateKey,
    },
  });

  return auth;
};

const shareFile = (id: string): string =>
  `https://docs.google.com/document/d/${id}/edit`;

const auth = getGoogleAuth();
const driveService = google.drive({ version: 'v3', auth });
const docsService = google.docs({ version: 'v1', auth });

const driveFolder = config.google.driveFolder;

export { driveService, docsService, driveFolder, shareFile };
