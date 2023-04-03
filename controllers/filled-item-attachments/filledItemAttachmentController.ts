import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import formidable from 'formidable';

import { createFilledItemAttachment } from './createFilledItemAttachment';
import { deleteFilledItemAttachment } from './deleteFilledItemAttachment';
import { getFilledItemAttachment } from './getFilledItemAttachment';
import { downloadFilledItemAttachment } from './downloadFilledItemAttachment';

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
        const user = await createFilledItemAttachment(session.user.email, {
          filledItemId: parseInt(firstOf(fields.filledItemId)),
          friendlyName: firstOf(fields.friendlyName),
          file: firstOf(files.file)
        });

        res.json({
          ok: true,
          user
        });

        return resolve();
      } catch (err) {
        if (err.name === 'CreateFilledItemAttachmentError' || err.name === 'CreateAttachmentError') {
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
    await deleteFilledItemAttachment(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DeleteFilledItemAttachmentError' || err.name === 'GetFilledItemAttachmentError') {
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
    const getResponse = await getFilledItemAttachment(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    response = {
      ok: true,
      attachment: getResponse.attachment
    };
  } catch (err) {
    if (err.name === 'GetFilledItemAttachmentError') {
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

export const download = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    let response = await downloadFilledItemAttachment(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));

    if (!response) {
      return res.status(400).json({
        ok: false,
        error: 'DOCUMENT_NOT_FOUND'
      });
    }

    const { stream, filename, contentType } = response;

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return stream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};
