import { NextApiRequest, NextApiResponse } from 'next';

import { createFilledContract } from './createFilledContract';
import { deleteFilledContract } from './deleteFilledContract';
import {
  getFilledContract,
  downloadContractBy,
  downloadSignatureBy,
} from './getFilledContract';
import { listFilledContracts } from './listFilledContracts';
import { signContract } from './signContract';
import {
  acceptOrDeclineFilledContract,
  fillContractOptions,
} from './updateFilledContract';
import { jsonToXml } from '@/lib/objectToXml';

import idFromQueryParam from '@/lib/idFromQueryParam';

const acceptOrDecline = async (
  action: 'accept' | 'decline',
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id } = req.query;

  try {
    await acceptOrDeclineFilledContract(
      req.session.user.email,
      idFromQueryParam(id),
      action,
    );
    return res.json({ ok: true });
  } catch (err) {
    if (
      err.name === 'FilledContractUpdateError' ||
      err.name === 'OptionValidationError'
    ) {
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

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { own, foreign, witness } = await listFilledContracts(
      req.session.user.email,
    );
    return res.json({
      ok: true,
      own,
      foreign,
      witness,
    });
  } catch (err) {
    if (err.name === 'ListFilledContractsError') {
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
  const { id, xml } = req.query;
  let response = null;

  try {
    const filledContract = await getFilledContract(
      req.session.user.email,
      idFromQueryParam(id),
    );
    response = {
      ok: true,
      filledContract,
    };
  } catch (err) {
    if (err.name === 'GetFilledContractError') {
      response = {
        ok: false,
        error: err.code,
      };
      res.status(400);
    } else {
      console.error(err);
      response = {
        ok: false,
        error: 'INTERNAL_SERVER_ERROR',
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

  try {
    const response = await downloadContractBy(
      req.session.user.email,
      Array.isArray(id) ? id[0] : id,
    );

    if (!response) {
      return res.status(400).json({
        ok: false,
        error: 'DOCUMENT_NOT_FOUND',
      });
    }

    const { stream, extension, contentType } = response;

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=${encodeURI(
        `contract_${new Date().getTime()}${extension}`,
      )}`,
    );

    return stream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const create = async (req: NextApiRequest, res: NextApiResponse) => {
  const { friendlyName, buyerEmail, contractId, filledItemId } = req.body;

  try {
    const filledContract = await createFilledContract(req.session.user.email, {
      friendlyName,
      buyerEmail,
      contractId,
      filledItemId: idFromQueryParam(filledItemId),
    });

    return res.json({
      ok: true,
      filledContract: filledContract.toJSON(),
    });
  } catch (err) {
    if (err.name === 'CreateFilledContractError') {
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

export const accept = async (req: NextApiRequest, res: NextApiResponse) => {
  return acceptOrDecline('accept', req, res);
};

export const decline = async (req: NextApiRequest, res: NextApiResponse) => {
  return acceptOrDecline('decline', req, res);
};

export const destroy = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    await deleteFilledContract(req.session.user.email, idFromQueryParam(id));
    return res.json({ ok: true });
  } catch (err) {
    if (
      err.name === 'DeleteContractError' ||
      err.name === 'GetFilledContractError'
    ) {
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

export const fill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { options } = req.body;

  try {
    await fillContractOptions(
      req.session.user.email,
      idFromQueryParam(id),
      options,
    );
    return res.json({ ok: true });
  } catch (err) {
    if (
      err.name === 'FilledContractUpdateError' ||
      err.name === 'OptionValidationError'
    ) {
      return res.status(400).json({
        ok: false,
        error: err.code,
        details: err.details,
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const sign = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;
  const { signatureData } = req.body;

  try {
    await signContract(
      req.session.user.email,
      idFromQueryParam(id),
      signatureData,
    );
    return res.json({ ok: true });
  } catch (err) {
    if (err.name === 'SignContractError') {
      return res.status(400).json({
        ok: false,
        error: err.code,
        details: err.details,
      });
    }

    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};

export const downloadSignature = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { id, signId } = req.query;

  try {
    const stream = await downloadSignatureBy(
      req.session.user.email,
      idFromQueryParam(id),
      idFromQueryParam(signId),
    );

    if (!stream) {
      return res.status(400).json({
        ok: false,
        error: 'SIGNATURE_NOT_FOUND',
      });
    }

    res.setHeader('Content-Type', 'image/png');

    // Cache all signatures on client side
    // so that we don't end up spamming the server
    res.setHeader('Cache-Control', 'max-age=31536000');

    return stream.pipe(res);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};
