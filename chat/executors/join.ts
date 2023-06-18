import { Connection } from 'typeorm';
import { Server, Socket } from 'socket.io';

import { BaseExecutorResponse, EventExecutor } from './_base';

import { FilledContract } from '@/db/models/contracts/FilledContract';
import { User } from '@/services/db';
import { isWitnessOf } from '@/controllers/filled-contracts/signUtils';

interface JoinEventData {
  filledContractId: number;
}

interface JoinEventResponse extends BaseExecutorResponse {}

export class JoinEventExecutor
  implements EventExecutor<JoinEventData, JoinEventResponse>
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
    data: JoinEventData,
  ): Promise<JoinEventResponse> {
    const filledContractRepository = this.db.getRepository(FilledContract);

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

    socket.join(`filled-contract-${filledContract.id}`);

    return {
      ok: true,
    };
  }
}
