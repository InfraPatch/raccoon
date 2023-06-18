import { Server, Socket } from 'socket.io';

import { EventExecutor } from './_base';
import { JoinEventExecutor } from './join';
import { LeaveEventExecutor } from './leave';
import { MessageEventExecutor } from './message';
import { Connection } from 'typeorm';
import { User } from '@/services/db';

export enum EventType {
  MESSAGE = 'chat-message',
  JOIN = 'join',
  LEAVE = 'leave',
}

export class ExectuorRepository {
  private executors: Map<EventType, EventExecutor> = new Map();

  private joinExecutor: JoinEventExecutor;
  private leaveExecutor: LeaveEventExecutor;
  private messageExecutor: MessageEventExecutor;

  private user: User;

  public constructor(db: Connection, loggedInUser: User) {
    this.joinExecutor = new JoinEventExecutor(loggedInUser, db);
    this.leaveExecutor = new LeaveEventExecutor(loggedInUser, db);
    this.messageExecutor = new MessageEventExecutor(loggedInUser, db);

    this.register(EventType.JOIN, this.joinExecutor);
    this.register(EventType.LEAVE, this.leaveExecutor);
    this.register(EventType.MESSAGE, this.messageExecutor);

    this.user = loggedInUser;
  }

  public register(event: EventType, executor: EventExecutor): void {
    this.executors.set(event, executor);
  }

  public get(event: EventType): EventExecutor {
    return this.executors.get(event);
  }

  public has(event: EventType): boolean {
    return this.executors.has(event);
  }

  public async handle(
    event: EventType,
    io: Server,
    socket: Socket,
    data: any,
  ): Promise<void> {
    if (!this.has(event)) {
      throw new Error(`No executor for event ${event}`);
    }

    const executor = this.get(event);

    if (!executor) {
      return;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SOCKET] ${event} (uid ${this.user.id}) ->`, data);
    }

    const response = await executor.execute(io, socket, data);

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SOCKET] ${event} (uid ${this.user.id}) <-`, response);
    }

    if (!response.ok) {
      socket.emit('error', response.error ?? 'INTERNAL_SERVER_ERROR');
    }
  }
}
