import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import formidable from 'formidable';

import { createFilledContractAttachment } from './createFilledContractAttachment';
import { deleteFilledContractAttachment } from './deleteFilledContractAttachment';
import { getFilledContractAttachment } from './getFilledContractAttachment';
import { jsonToXml } from '@/lib/objectToXml';
import { firstOf } from '../users/usersController';

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  const form = new formidable.IncomingForm();

  return new Promise<void>(resolve => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR'
        });

        return resolve();
      }

      try {
        const user = await createFilledContractAttachment(session.user.email, {
          filledContractId: parseInt(firstOf(fields.filledContractId)),
          friendlyName: firstOf(fields.friendlyName),
          file: firstOf(files.file)
        });

        res.json({
          ok: true,
          user
        });

        return resolve();
      } catch (err) {
        if (err.name === 'CreateFilledContractAttachmentError') {
          res.status(400).json({
            ok: false,
            error: err.code
          });
          return resolve();
        }

        console.error(err);

        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR'
        });

        return resolve();
      }
    });
  });
};

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    await deleteFilledContractAttachment(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DeleteFilledContractAttachmentError' || err.name === 'GetFilledContractAttachmentError') {
      return res.status(400).json({
        ok: false,
        error: err.code
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, xml } = req.query;
  const session = await getSession({ req });
  let response = null;

  try {
    const getResponse = await getFilledContractAttachment(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    response = {
      ok: true,
      attachment: getResponse.attachment
    };
  } catch (err) {
    if (err.name === 'GetFilledContractAttachmentError') {
      response = {
        ok: false,
        error: err.code
      };
      res.status(400);
    } else {
      console.error(err);
      response = {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR'
      };
      res.status(500);
    }
  }

  if (xml) {
    res.setHeader('Content-Type', 'text/xml');
    res.send(jsonToXml({ root: response }));
  } else {
    res.json(response);
  }
};
