import { NextApiRequest, NextApiResponse } from 'next';

import { createItem } from './createItem';
import { getItems } from './getItems';
import { getItem } from './getItem';
import { updateItem } from './updateItem';
import { deleteItem } from './deleteItem';

import { firstOf } from '../users/usersController';

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const items = await getItems();

    return res.json({
      ok: true,
      items: items.map(item => item.toJSON())
    });
  } catch (err) {
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
    const item = await getItem({ id: parseInt(firstOf(id)) });

    return res.json({
      ok: true,
      item: item.toJSON()
    });
  } catch (err) {
    if (err.name === 'GetItemError') {
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

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { friendlyName, slug, description } = req.body;

  try {
    const item = await createItem({ friendlyName, slug, description });

    return res.json({
      ok: true,
      item: item.toJSON()
    });
  } catch (err) {
    if (err.name === 'ItemCreationError') {
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

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { friendlyName, description } = req.body;

  try {
    const item = await updateItem(parseInt(firstOf(id)), { friendlyName, description });

    return res.json({
      ok: true,
      item
    });
  } catch (err) {
    if (err.name === 'ItemUpdateError') {
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
    await deleteItem({ id: parseInt(firstOf(id)) });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};
