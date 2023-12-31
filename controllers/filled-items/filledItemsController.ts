import { NextApiRequest, NextApiResponse } from 'next';

import { createFilledItem } from './createFilledItem';
import { deleteFilledItem } from './deleteFilledItem';
import { getFilledItem } from './getFilledItem';
import { listFilledItems } from './listFilledItems';
import { fillItemOptions } from './updateFilledItem';
import { jsonToXml } from '@/lib/objectToXml';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  try {
    const { filledItems } = await listFilledItems(
      req.session.user.email,
      Array.isArray(slug) ? slug[0] : slug,
    );
    return res.json({
      ok: true,
      filledItems,
    });
  } catch (err) {
    if (err.name === 'ListFilledItemsError') {
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
    const filledItem = await getFilledItem(
      req.session.user.email,
      idFromQueryParam(id),
    );
    response = {
      ok: true,
      filledItem,
    };
  } catch (err) {
    if (err.name === 'GetFilledItemError') {
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

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { friendlyName, itemSlug, options } = req.body;

  try {
    const filledItem = await createFilledItem(req.session.user.email, {
      friendlyName,
      itemSlug,
      options,
    });

    return res.json({
      ok: true,
      filledItem: filledItem.toJSON(),
    });
  } catch (err) {
    if (
      err.name === 'CreateFilledItemError' ||
      err.name === 'OptionValidationError'
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

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await deleteFilledItem(req.session.user.email, idFromQueryParam(id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'GetFilledItemError') {
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

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { friendlyName, options } = req.body;

  try {
    await fillItemOptions(
      req.session.user.email,
      idFromQueryParam(id),
      friendlyName,
      options,
    );

    return res.json({ ok: true });
  } catch (err) {
    if (
      err.name === 'FilledItemUpdateError' ||
      err.name === 'OptionValidationError'
    ) {
      return res.status(400).json({
        ok: false,
        error: err.code,
        details: err.details,
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};
