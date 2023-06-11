import { NextApiRequest, NextApiResponse } from 'next';

import { createContractOption } from './createContractOption';
import { getContractOptions } from './getContractOptions';
import { getContractOption } from './getContractOption';
import { deleteContractOption } from './deleteContractOption';
import { updateContractOption } from './updateContractOption';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const listContractOptions = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id } = req.body;

  try {
    const options = await getContractOptions({ id: idFromQueryParam(id) });

    return res.json({
      ok: true,
      options: options.map((value) => value.toJSON()),
    });
  } catch (err) {
    if (err.name === 'GetContractOptionsError') {
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
  const { id } = req.query;

  try {
    const option = await getContractOption({ id: idFromQueryParam(id) });

    return res.json({
      ok: true,
      option: option.toJSON(),
    });
  } catch (err) {
    if (err.name === 'GetContractOptionError') {
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
    await deleteContractOption({ id: idFromQueryParam(id) });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const update = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const {
    type,
    priority,
    friendlyName,
    longDescription,
    hint,
    replacementString,
    minimumValue,
    maximumValue,
    isSeller,
  } = req.body;

  try {
    await updateContractOption({
      id: idFromQueryParam(id),
      type: parseInt(Array.isArray(type) ? type[0] : type),
      priority: parseInt(Array.isArray(priority) ? priority[0] : priority),
      friendlyName,
      longDescription,
      hint,
      replacementString,
      minimumValue: parseInt(
        Array.isArray(minimumValue) ? minimumValue[0] : minimumValue,
      ),
      maximumValue: parseInt(
        Array.isArray(maximumValue) ? maximumValue[0] : maximumValue,
      ),
      isSeller,
    });

    return res.json({
      ok: true,
    });
  } catch (err) {
    if (err.name === 'ContractOptionUpdateError') {
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

export const newContractOption = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const {
    contractId,
    type,
    priority,
    friendlyName,
    longDescription,
    hint,
    replacementString,
    minimumValue,
    maximumValue,
    isSeller,
  } = req.body;

  try {
    const option = await createContractOption({
      contractId: parseInt(
        Array.isArray(contractId) ? contractId[0] : contractId,
      ),
      type: parseInt(Array.isArray(type) ? type[0] : type),
      priority: parseInt(Array.isArray(priority) ? priority[0] : priority),
      friendlyName,
      longDescription,
      hint,
      replacementString,
      minimumValue: parseInt(
        Array.isArray(minimumValue) ? minimumValue[0] : minimumValue,
      ),
      maximumValue: parseInt(
        Array.isArray(maximumValue) ? maximumValue[0] : maximumValue,
      ),
      isSeller,
    });

    return res.json({
      ok: true,
      option: option.toJSON(),
    });
  } catch (err) {
    if (err.name === 'ContractOptionCreationError') {
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
