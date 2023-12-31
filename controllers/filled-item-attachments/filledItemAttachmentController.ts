import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

import { createFilledItemAttachment } from './createFilledItemAttachment';
import { deleteFilledItemAttachment } from './deleteFilledItemAttachment';
import { getFilledItemAttachment } from './getFilledItemAttachment';
import { downloadFilledItemAttachment } from './downloadFilledItemAttachment';

import { jsonToXml } from '@/lib/objectToXml';
import { firstOf } from '../users/usersController';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = formidable();

  return new Promise<void>((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR',
        });

        return resolve();
      }

      try {
        const user = await createFilledItemAttachment(req.session.user.email, {
          filledItemId: parseInt(firstOf(fields.filledItemId)),
          friendlyName: firstOf(fields.friendlyName),
          file: firstOf(files.file),
        });

        res.json({
          ok: true,
          user,
        });

        return resolve();
      } catch (err) {
        if (
          err.name === 'CreateFilledItemAttachmentError' ||
          err.name === 'CreateAttachmentError'
        ) {
          res.status(400).json({
            ok: false,
            error: err.code,
          });
          return resolve();
        }

        console.error(err);

        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR',
        });

        return resolve();
      }
    });
  });
};

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await deleteFilledItemAttachment(
      req.session.user.email,
      idFromQueryParam(id),
    );
    return res.json({ ok: true });
  } catch (err) {
    if (
      err.name === 'DeleteFilledItemAttachmentError' ||
      err.name === 'GetFilledItemAttachmentError'
    ) {
      return res.status(400).json({
        ok: false,
        error: err.code,
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, xml } = req.query;
  let response = null;

  try {
    const getResponse = await getFilledItemAttachment(
      req.session.user.email,
      idFromQueryParam(id),
    );
    response = {
      ok: true,
      attachment: getResponse.attachment,
    };
  } catch (err) {
    if (err.name === 'GetFilledItemAttachmentError') {
      response = {
        ok: false,
        error: err.code,
      };
      res.status(400);
    } else {
      console.error(err);
      response = {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
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

  try {
    const response = await downloadFilledItemAttachment(
      req.session.user.email,
      idFromQueryParam(id),
    );

    if (!response) {
      return res.status(400).json({
        ok: false,
        error: 'DOCUMENT_NOT_FOUND',
      });
    }

    const { stream, filename, contentType } = response;

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURI(filename)}`,
    );

    return stream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};
