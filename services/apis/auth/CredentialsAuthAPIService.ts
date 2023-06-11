import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { User } from '@/db/models/auth/User';

export interface CredentialsSignInAPIRequest {
  csrfToken: string;
  email: string;
  password: string;
}

export interface CredentialsRegisterAPIRequest {
  name: string;
  email: string;
  password: string;
  password2: string;
}

export interface CredentialsSignInAPIResponse extends APIResponse {
  user: User;
}

export interface CredentialsRegisterAPIResponse extends APIResponse {
  user: User;
}

class CredentialsAuthAPIService {
  static AUTHENTICATION_CALLBACK_URL = '/api/auth/callback/credentials';
  static REGISTER_URL = '/api/users';

  public async signIn({
    csrfToken,
    email,
    password,
  }: CredentialsSignInAPIRequest): Promise<CredentialsSignInAPIResponse> {
    const payload = new URLSearchParams();
    payload.append('csrfToken', csrfToken);
    payload.append('email', email);
    payload.append('password', password);

    return axiosService
      .post(CredentialsAuthAPIService.AUTHENTICATION_CALLBACK_URL, payload, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .then((res) => res.data);
  }

  public async register(
    payload: CredentialsRegisterAPIRequest,
  ): Promise<CredentialsRegisterAPIResponse> {
    return axiosService
      .post(CredentialsAuthAPIService.REGISTER_URL, payload)
      .then((res) => res.data);
  }
}

export { CredentialsAuthAPIService };
