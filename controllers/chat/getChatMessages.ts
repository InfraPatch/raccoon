import db from '@/services/db';
import { ChatMessage } from '@/db/models/chat/ChatMessage';

import { getFilledContract } from '../filled-contracts/getFilledContract';

class GetChatMessagesError extends Error {
  code: string;

  constructor(code: string) {
    super();
    this.name = 'GetChatMessagesError';
    this.code = code;
  }
}

export const getChatMessages = async (
  email: string,
  contractId: number,
): Promise<ChatMessage[]> => {
  try {
    const filledContract = await getFilledContract(email, contractId, true);

    const chatMessageRepository = db.getRepository(ChatMessage);

    const messages = await chatMessageRepository.find({
      where: { filledContract },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });

    return messages;
  } catch (e) {
    if (e.name === 'GetFilledContractError') {
      throw new GetChatMessagesError(e.code);
    }

    throw e;
  }
};
