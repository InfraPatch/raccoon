import * as nodemailer from 'nodemailer';
import config from '@/config';

let transport: nodemailer.Transporter | null = null;

const initializeTransport = () => {
  if (transport) {
    return;
  }

  transport = nodemailer.createTransport({
    pool: true,
    host: config.email.host,
    port: config.email.port,
    auth: {
      user: config.email.username,
      pass: config.email.password
    }
  });
};

initializeTransport();

const sendMessage = (message: nodemailer.SendMailOptions): Promise<void> => {
  return new Promise((resolve, reject) => {
    initializeTransport();

    transport.sendMail({
      ...message,
      from: config.email.emailFrom
    }, (err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    }));
  });
};

export {
  transport,
  sendMessage
};
