import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

import { firstOf } from '../users/usersController';
import { createContract } from './createContract';

export const newContract = async (req: NextApiRequest, res: NextApiResponse) => {
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
        const contract = await createContract({
          friendlyName: firstOf(fields.friendlyName),
          description: firstOf(fields.description),
          file: firstOf(files.file)
        });

        res.json({
          ok: true,
          contract: contract.toJSON()
        });
        return resolve();
      } catch (err) {
        if (err.name === 'ContractCreationError') {
          return res.status(400).json({
            ok: false,
            error: err.code
          });
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
