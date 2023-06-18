import { NextApiRequest, NextApiResponse } from 'next';

import { getChatMessages } from './getChatMessages';

import idFromQueryParam from '@/lib/idFromQueryParam';

export const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.query;

  try {
    const messages = await getChatMessages(
      req.session.user.email,
      idFromQueryParam(id),
    );
    return res.json({
      ok: true,
      messages: messages.map((m) => m.toJSON()),
    });
  } catch (err) {
    if (err.name === 'GetChatMessagesError') {
      return res.status(400).json({
        ok: false,
        error: err.code,
      });
    }

    return res.status(500).json({
      ok: false,
      error: 'INTERNAL_SERVER_ERROR',
    });
  }
};
