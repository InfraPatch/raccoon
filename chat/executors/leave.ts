import { Connection } from 'typeorm';
import { Server, Socket } from 'socket.io';

import { BaseExecutorResponse, EventExecutor } from './_base';

import { User } from '@/services/db';

interface LeaveEventData {
  filledContractId: number;
}

interface LeaveEventResponse extends BaseExecutorResponse {}

export class LeaveEventExecutor
  implements EventExecutor<LeaveEventData, LeaveEventResponse>
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
    data: LeaveEventData,
  ): Promise<LeaveEventResponse> {
    socket.leave(`filled-contract-${data.filledContractId}`);

    return {
      ok: true,
    };
  }
}
