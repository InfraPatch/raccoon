import { Server, Socket } from 'socket.io';

export interface BaseExecutorResponse {
  ok: boolean;
  error?: string;
}

export abstract class EventExecutor<T = any, R = BaseExecutorResponse> {
  public abstract execute(io: Server, socket: Socket, data: T): Promise<R>;
}
