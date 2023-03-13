import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { User } from '@/db/models/auth/User';

export interface GetLoggedInUserAPIResponse extends APIResponse {
  user: User;
};

export interface MakeAdminAPIRequest {
  email: string;
};

export interface MakeAdminAPIResponse extends APIResponse {};

class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';
  static MAKE_ADMIN_URL = '/api/users/make-admin';

  public async getLoggedInUser(): Promise<GetLoggedInUserAPIResponse> {
    return axiosService.get(UsersAPIService.GET_LOGGED_IN_USER_URL)
      .then(res => res.data);
  }

  public async makeAdmin({ email }: MakeAdminAPIRequest): Promise<MakeAdminAPIResponse> {
    return axiosService.post(UsersAPIService.MAKE_ADMIN_URL, { email })
      .then(res => res.data);
  }
}

export {
  UsersAPIService
};
