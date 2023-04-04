/**
 * This file acts as an example for a potential
 * AVDH authenticator implementation.
 *
 * AVDH authenticators are responsible for delegating
 * the verification of user details to external services.
 *
 * These authenticators count as optional modules.
 */
import { NextApiRequest, NextApiResponse } from 'next';
import bar from 'next-bar';

export enum PersonalIdentifierType {
  IDENTITY_CARD,
  PASSPORT,
  DRIVERS_LICENSE
};

export interface IUser {
  name?: string;
  email?: string;
  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;
  birthPlace?: string;
}

export interface IAVDHVerificationErrorMessage {
  en: string;
  hu: string;
}

export interface IAVDHVerificationResponse {
  ok: boolean;
  error?: string;
  message?: IAVDHVerificationErrorMessage;
}

export const authenticateUserDetails = async (req: NextApiRequest, res: NextApiResponse) => {
  const user : IUser = req.body;

  // For testing purposes, if the user's name contains the substring
  // "HELYTELEN", AVDH verification will immediately fail.

  if (user.name && user.name.includes('HELYTELEN')) {
    const response : IAVDHVerificationResponse = {
      ok: false,
      error: 'AVDH_TEST_FAILURE',
      message: {
        en: 'We have a reason to believe that your name is invalid!',
        hu: 'Úgy véljük, hogy helytelen a neved!'
      }
    };

    return res.json(response);
  }

  const response : IAVDHVerificationResponse = {
    ok: true
  };

  return res.json(response);
};

export default bar({
  post: authenticateUserDetails
});
