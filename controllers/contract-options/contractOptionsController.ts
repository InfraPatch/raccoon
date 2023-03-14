import { NextApiRequest, NextApiResponse } from 'next';

//import { createContractOption } from './createContractOption';
import { getContractOptions } from './getContractOptions';
import { getContractOption } from './getContractOption';
import { deleteContractOption } from './deleteContractOption';
//import { updateContractOption } from './updateContractOption';

export const listContractOptions = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;

  try {
    const options = await getContractOptions({ id: parseInt(Array.isArray(id) ? id[0] : id) });

    return res.json({
      ok: true,
      options: options.map(value => value.toJSON())
    });
  } catch (err) {
    if (err.name === 'GetContractOptionsError') {
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
    const option = await getContractOption({ id: parseInt(Array.isArray(id) ? id[0] : id) });

    return res.json({
      ok: true,
      option: option.toJSON()
    });
  } catch (err) {
    if (err.name === 'GetContractOptionError') {
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
    await deleteContractOption({ id: parseInt(Array.isArray(id) ? id[0] : id) });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};
