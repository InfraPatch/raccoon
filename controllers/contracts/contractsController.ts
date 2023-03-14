import { NextApiRequest, NextApiResponse } from 'next';

import formidable from 'formidable';

import { firstOf } from '../users/usersController';
import { createContract } from './createContract';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

export const newContract = async (req: NextApiRequest, res: NextApiResponse) => {
  const form = new formidable.IncomingForm();

  console.log("new contract");

  return new Promise<void>(resolve => {
    console.log("form parse please");
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({
          ok: false,
          error: 'INTERNAL_SERVER_ERROR'
        });

        console.log("error " + err);
        return resolve();
      }

      console.log("try to ceate contract");
      console.log(fields);
      console.log(files);
      try {
        const contract = await createContract({
          friendlyName: firstOf(fields.friendlyName),
          description: firstOf(fields.description),
          file: firstOf(files.file)
        });
        console.log("done... hopefully\n");

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
