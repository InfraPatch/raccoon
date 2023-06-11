import { NextApiRequest, NextApiResponse } from 'next';

import * as mail from '@/services/email';

import { IContactFormFields } from '@/components/contact-form/IContactFormFields';
import EmailValidator from 'email-validator';
import config from '@/config';

const emailTemplate = `Hello!

A new message has arrived through the contact form.

Name: {{ name }}
Email: {{ email }}
Subject: {{ subject }}

----------------------------------------

{{ message }}

----------------------------------------
`;

export const send = async (req: NextApiRequest, res: NextApiResponse) => {
  if (process.env.FIREWALLED_INSTANCE) {
    return res.status(400).json({
      ok: false,
      error: 'FIREWALLED_INSTANCE',
    });
  }

  const { name, email, subject, message }: IContactFormFields = req.body;

  if (!name || name.length < 2) {
    return res.status(400).json({
      ok: false,
      error: 'NAME_TOO_SHORT',
      details: {
        min: 2,
      },
    });
  }

  if (!EmailValidator.validate(email)) {
    return res.status(400).json({
      ok: false,
      error: 'INVALID_EMAIL',
    });
  }

  if (!subject || subject.length < 5) {
    return res.status(400).json({
      ok: false,
      error: 'SUBJECT_TOO_SHORT',
      details: {
        min: 5,
      },
    });
  }

  if (!message || message.length < 10) {
    return res.status(400).json({
      ok: false,
      error: 'MESSAGE_TOO_SHORT',
      details: {
        min: 10,
      },
    });
  }

  const text = emailTemplate
    .replace('{{ name }}', name)
    .replace('{{ email }}', email)
    .replace('{{ subject }}', subject)
    .replace('{{ message }}', message);

  if (!config.email.contactEmail) {
    return res.status(400).json({
      ok: false,
      error: 'EMAIL_SEND_FAILURE',
    });
  }

  try {
    await mail.sendMessage({
      to: config.email.contactEmail,
      replyTo: email,
      subject,
      text,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'EMAIL_SEND_FAILURE',
    });
  }
};
