import { NextApiRequest, NextApiResponse } from 'next';

import { createItemOption } from './createItemOption';
import { getItemOptions } from './getItemOptions';
import { getItemOption } from './getItemOption';
import { deleteItemOption } from './deleteItemOption';
import { updateItemOption } from './updateItemOption';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  try {
    const options = await getItemOptions({ id: idFromQueryParam(id) });

    return res.json({
      ok: true,
      options: options.map(value => value.toJSON())
    });
  } catch (err) {
    if (err.name === 'GetItemOptionsError') {
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
  const { id } = req.query;

  try {
    const option = await getItemOption({ id: idFromQueryParam(id) });

    return res.json({
      ok: true,
      option: option.toJSON()
    });
  } catch (err) {
    if (err.name === 'GetItemOptionError') {
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

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await deleteItemOption({ id: idFromQueryParam(id) });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { type, priority, friendlyName, longDescription, hint, replacementString, minimumValue, maximumValue } = req.body;

  try {
    await updateItemOption({
      id: idFromQueryParam(id),
      type: parseInt(Array.isArray(type) ? type[0] : type),
      priority: parseInt(Array.isArray(priority) ? priority[0] : priority),
      friendlyName, longDescription, hint, replacementString,
      minimumValue: parseInt(Array.isArray(minimumValue) ? minimumValue[0] : minimumValue),
      maximumValue: parseInt(Array.isArray(maximumValue) ? maximumValue[0] : maximumValue)
    });

    return res.json({
      ok: true
    });
  } catch (err) {
    if (err.name === 'ItemOptionUpdateError') {
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

export const newItemOption = async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId, type, priority, friendlyName, longDescription, hint, replacementString, minimumValue, maximumValue, isSeller } = req.body;

  try {
    const option = await createItemOption({
      itemId: parseInt(Array.isArray(itemId) ? itemId[0] : itemId),
      type: parseInt(Array.isArray(type) ? type[0] : type),
      priority: parseInt(Array.isArray(priority) ? priority[0] : priority),
      friendlyName, longDescription, hint, replacementString,
      minimumValue: parseInt(Array.isArray(minimumValue) ? minimumValue[0] : minimumValue),
      maximumValue: parseInt(Array.isArray(maximumValue) ? maximumValue[0] : maximumValue)
    });

    return res.json({
      ok: true,
      option: option.toJSON()
    });
  } catch (err) {
    if (err.name === 'ItemOptionCreationError') {
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
