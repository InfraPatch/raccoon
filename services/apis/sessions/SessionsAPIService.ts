import axiosService, { APIResponse } from '@/services/axios';

import { User } from '@/db/models/auth/User';

export interface CreateSessionAPIRequest {
  email: string;
  password: string;
}

export interface CreateSessionAPIResponse extends APIResponse {
  user: User;
}

export interface DestroySessionAPIResponse extends APIResponse {}

export class SessionsAPIService {
  static CREATE_SESSION_URL = '/api/sessions/login';
  static DESTROY_SESSION_URL = '/api/sessions/logout';

  public async login({
    email,
    password,
  }: CreateSessionAPIRequest): Promise<CreateSessionAPIResponse> {
    return axiosService
      .post(SessionsAPIService.CREATE_SESSION_URL, { email, password })
      .then((res) => res.data);
  }

  public async logout(): Promise<DestroySessionAPIResponse> {
    return axiosService
      .post(SessionsAPIService.DESTROY_SESSION_URL)
      .then((res) => res.data);
  }
}
