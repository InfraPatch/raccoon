import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { User } from '@/db/models/auth/User';

export interface CredentialsSignInAPIRequest {
  csrfToken: string;
  email: string;
  password: string;
};

export interface CredentialsSignInAPIResponse extends APIResponse {
  user: User;
};

class CredentialsAuthAPIService {
  static CALLBACK_URL = '/api/auth/callback/credentials';

  public async signIn({ csrfToken, email, password }: CredentialsSignInAPIRequest): Promise<CredentialsSignInAPIResponse> {
    const payload = new URLSearchParams();
    payload.append('csrfToken', csrfToken);
    payload.append('email', email);
    payload.append('password', password);

    return axiosService.post(CredentialsAuthAPIService.CALLBACK_URL, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res.data);
  }
}

export {
  CredentialsAuthAPIService
};
