import { NextApiRequest, NextApiResponse } from 'next';
import { createContract } from './createContract';

export const newContract = async (req: NextApiRequest, res: NextApiResponse) => {
  const { friendlyName, description } = req.body;

  try {
    const contract = await createContract({ friendlyName, description });
    return res.json({
      ok: true,
      contract: contract.toJSON()
    });
  } catch (err) {
    if (err.name === 'ContractCreationError') {
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
