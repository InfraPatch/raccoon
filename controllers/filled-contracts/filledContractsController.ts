import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { createFilledContract } from './createFilledContract';
import { deleteFilledContract } from './deleteFilledContract';
import { getFilledContract, downloadContract } from './getFilledContract';
import { signContract } from './signContract';
import { acceptOrDeclineFilledContract, fillContractOptions } from './updateFilledContract';

const acceptOrDecline = async (action: 'accept' | 'decline', req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    await acceptOrDeclineFilledContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id), action);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'FilledContractUpdateError') {
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
  const session = await getSession({ req });

  try {
    const filledContract = await getFilledContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    return res.json({
      ok: true,
      filledContract
    });
  } catch (err) {
    if (err.name === 'GetFilledContractError') {
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

export const download = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    const stream = await downloadContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));

    if (!stream) {
      return res.status(400).json({
        ok: false,
        error: 'DOCUMENT_NOT_FOUND'
      });
    }

    return stream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { friendlyName, buyerEmail, contractId } = req.body;
  const session = await getSession({ req });

  try {
    const filledContract = await createFilledContract(session.user.email, {
      friendlyName,
      buyerEmail,
      contractId
    });

    return res.json({
      ok: true,
      filledContract: filledContract.toJSON()
    });
  } catch (err) {
    if (err.name === 'CreateFilledContractError') {
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

export const accept = async (req: NextApiRequest, res: NextApiResponse) => {
  return acceptOrDecline('accept', req, res);
};

export const decline = async (req: NextApiRequest, res: NextApiResponse) => {
  return acceptOrDecline('decline', req, res);
};

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    await deleteFilledContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'DeleteContractError') {
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

export const fill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { options } = req.body;

  const session = await getSession({ req });

  try {
    await fillContractOptions(session.user.email, parseInt(Array.isArray(id) ? id[0] : id), options);
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'FilledContractUpdateError') {
      return res.status(400).json({
        ok: false,
        error: err.code,
        details: err.details
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

export const sign = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const session = await getSession({ req });

  try {
    await signContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'SignContractError') {
      return res.status(400).json({
        ok: false,
        error: err.code,
        details: err.details
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};