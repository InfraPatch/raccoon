import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { createWitnessSignature } from './createWitnessSignature';
import { deleteWitnessSignature } from './deleteWitnessSignature';
import { getWitnessSignature } from './getWitnessSignature';
import { jsonToXml } from '@/lib/objectToXml';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { filledContractId, witnessEmail } = req.body;
  const session = await getSession({ req });

  try {
    const witnessSignature = await createWitnessSignature(session.user.email, {
      filledContractId,
      witnessEmail
    });

    return res.json({
      ok: true,
      witnessSignature: witnessSignature.toJSON()
    });
  } catch (err) {
    if (err.name === 'CreateWitnessSignatureError') {
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
  const session = await getSession({ req });

  try {
    await deleteWitnessSignature(session.user.email, idFromQueryParam(id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DeleteWitnessSignatureError' || err.name === 'GetWitnessSignatureError') {
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
    const getResponse = await getWitnessSignature(session.user.email, idFromQueryParam(id));
    response = {
      ok: true,
      witnessSignature: getResponse.signature
    };
  } catch (err) {
    if (err.name === 'GetWitnessSignatureError') {
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
