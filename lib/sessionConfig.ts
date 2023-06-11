import config from '@/config';
import { IronSessionOptions } from 'iron-session';

const sessionConfig: IronSessionOptions = {
  cookieName: 'raccoon_sess',
  password: config.app.sessionSecret,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export default sessionConfig;
