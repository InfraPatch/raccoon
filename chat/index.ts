import express from 'express';
import dotenv from 'dotenv';

import { Server } from 'socket.io';

dotenv.config();

import db from '@/services/db'; // this import must happen after dotenv.config()

import { ironSession } from 'iron-session/express';

import sessionConfig from '@/lib/sessionConfig';
import { EventType, ExectuorRepository } from './executors';
import { User } from '@/dist/ws/services/db';

const PORT = process.env.WS_PORT || process.env.PORT || 4679;

const session = ironSession(sessionConfig);

async function start() {
  const connection = await db.createNamedConnection('ws');

  const app = express();

  const server = app.listen(PORT, () => {
    console.log(`Websocket chat server is running on port ${PORT}`);
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.engine.use((req, res, next) => {
    const ironSessionValue = req.headers['iron-session'];
    if (!ironSessionValue) {
      return next();
    }

    req.headers.cookie = `raccoon_sess=${ironSessionValue}`;
    next();
  });

  io.engine.use(session);

  io.on('connection', async (socket) => {
    const user = socket.request.session.user;

    const executorRepository = new ExectuorRepository(connection, user as User);

    Object.values(EventType).forEach((eventName) => {
      socket.on(eventName, (data) => {
        executorRepository.handle(eventName, io, socket, data);
      });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
