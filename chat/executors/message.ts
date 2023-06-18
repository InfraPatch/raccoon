import { Connection } from 'typeorm';
import { Server, Socket } from 'socket.io';

import { BaseExecutorResponse, EventExecutor } from './_base';

import { User } from '@/services/db';

import { sanitize } from 'isomorphic-dompurify';
import { FilledContract } from '@/db/models/contracts/FilledContract';
import { ChatMessage } from '@/db/models/chat/ChatMessage';
import { isWitnessOf } from '@/controllers/filled-contracts/signUtils';

interface MessageEventData {
  filledContractId: number;
  message: string;
}

interface MessageEventResponse extends BaseExecutorResponse {}

export class MessageEventExecutor
  implements EventExecutor<MessageEventData, MessageEventResponse>
{
  private loggedInUser: User;
  private db: Connection;

  constructor(loggedInUser: User, db: Connection) {
    this.loggedInUser = loggedInUser;
    this.db = db;
  }

  public async execute(
    io: Server,
    socket: Socket,
    data: MessageEventData,
  ): Promise<MessageEventResponse> {
    const message = sanitize(data.message).trim();

    if (!message || message.length === 0) {
      return {
        ok: false,
        error: 'MESSAGE_IS_EMPTY',
      };
    }

    const userRepository = this.db.getRepository(User);
    const filledContractRepository = this.db.getRepository(FilledContract);
    const chatMessageRepository = this.db.getRepository(ChatMessage);

    const filledContract = await filledContractRepository.findOne(
      data.filledContractId,
      {
        relations: ['witnessSignatures'],
      },
    );

    if (!filledContract) {
      return {
        ok: false,
        error: 'FILLED_CONTRACT_NOT_FOUND',
      };
    }

    if (
      ![filledContract.userId, filledContract.buyerId].includes(
        this.loggedInUser.id,
      ) &&
      !isWitnessOf(this.loggedInUser.id, filledContract)
    ) {
      return {
        ok: false,
        error: 'ACCESS_TO_CONTRACT_DENIED',
      };
    }

    const user = await userRepository.findOne(this.loggedInUser.id);

    const chatMessage = new ChatMessage();
    chatMessage.filledContract = filledContract;
    chatMessage.user = user;
    chatMessage.message = message;

    await chatMessageRepository.save(chatMessage);

    io.to(`filled-contract-${filledContract.id}`).emit('chat-message', {
      message: chatMessage.toJSON(),
    });

    return {
      ok: true,
    };
  }
}
