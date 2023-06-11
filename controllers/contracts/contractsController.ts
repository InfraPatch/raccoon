import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

import { firstOf } from '../users/usersController';
import { createContract } from './createContract';
import { getContracts } from './getContracts';
import { getContract } from './getContract';
import { deleteContract } from './deleteContract';
import { updateContract } from './updateContract';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const listContracts = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  try {
    const contracts = await getContracts();

    return res.json({
      ok: true,
      contracts: contracts.map((value) => value.toJSON()),
    });
  } catch (err) {
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
    const contract = await getContract({ id: idFromQueryParam(id) });

    return res.json({
      ok: true,
      contract: contract.toJSON(),
    });
  } catch (err) {
    if (err.name === 'GetContractError') {
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
    await deleteContract({ id: idFromQueryParam(id) });
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
  const form = new formidable.IncomingForm();

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
        const contract = await updateContract({
          id: idFromQueryParam(id),
          friendlyName: firstOf(fields.friendlyName),
          description: firstOf(fields.description),
          file: firstOf(files.file),
        });

        res.json({
          ok: true,
          contract: contract,
        });
        return resolve();
      } catch (err) {
        if (err.name === 'ContractUpdateError') {
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

export const newContract = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const form = new formidable.IncomingForm();

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
        const contract = await createContract({
          friendlyName: firstOf(fields.friendlyName),
          description: firstOf(fields.description),
          itemSlug: firstOf(fields.itemSlug),
          file: firstOf(files.file),
        });

        res.json({
          ok: true,
          contract: contract.toJSON(),
        });
        return resolve();
      } catch (err) {
        if (err.name === 'ContractCreationError') {
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
