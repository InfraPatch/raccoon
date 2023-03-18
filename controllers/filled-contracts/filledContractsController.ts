import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/client';

import { createFilledContract } from './createFilledContract';
import { deleteFilledContract } from './deleteFilledContract';
import { getFilledContract, downloadContract } from './getFilledContract';
import { listFilledContracts } from './listFilledContracts';
import { signContract } from './signContract';
import { acceptOrDeclineFilledContract, fillContractOptions } from './updateFilledContract';

const objectToXml = (object) => Object.keys(object).reduce((reqStr, key) => {
  const value = object[key] || '';
  const isObject = typeof value === 'object';
  const isArray = Array.isArray(value);
  if (isArray) {
    return reqStr + value.reduce((accumulator, currentValue) =>
      accumulator + `<${key}>${typeof currentValue === 'object' ? objectToXml(currentValue) : (currentValue || '')}</${key}>`
      , '');
  }
  if (isObject) {
    return reqStr + `<${key}>${objectToXml(value)}</${key}>`;
  }
  return reqStr + `<${key}>${value}</${key}>`;
}, '');

const jsonToXml = (object) => {
  return "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>" + objectToXml(object);
};

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

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  try {
    const { own, foreign } = await listFilledContracts(session.user.email);
    return res.json({
      ok: true,
      own,
      foreign
    });
  } catch (err) {
    if (err.name === 'ListFilledContractsError') {
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
    const filledContract = await getFilledContract(session.user.email, parseInt(Array.isArray(id) ? id[0] : id));
    response = {
      ok: true,
      filledContract
    };
  } catch (err) {
    if (err.name === 'GetFilledContractError') {
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

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="contract_${new Date().getTime()}.docx`);

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
    if (err.name === 'DeleteContractError' || err.name === 'GetFilledContractError') {
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
