import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { PersonalIdentifierType, User } from '@/db/models/auth/User';

export interface GetLoggedInUserAPIResponse extends APIResponse {
  user: User;
}

export interface MakeAdminAPIRequest {
  email: string;
}

export type MakeAdminAPIResponse = APIResponse;

export interface MakeLawyerAPIRequest {
  email: string;
}

export type MakeLawyerAPIResponse = APIResponse;

export interface UpdateUserProfileAPIRequest {
  name?: string;
  image?: File;
}

export interface UpdateUserPasswordAPIRequest {
  password?: string;
  password2?: string;
  oldPassword?: string;
}

export interface UpdateUserIdentificationDetailsAPIRequest {
  motherName?: string;
  motherBirthDate?: Date;
  nationality?: string;
  personalIdentifierType?: PersonalIdentifierType;
  personalIdentifier?: string;
  phoneNumber?: string;
  birthDate?: Date;
  birthPlace?: string;
}

export type UpdateUserAPIRequest = UpdateUserProfileAPIRequest &
  UpdateUserPasswordAPIRequest &
  UpdateUserIdentificationDetailsAPIRequest;

export interface UpdateUserAPIResponse extends APIResponse {
  user: User;
}

class UsersAPIService {
  static GET_LOGGED_IN_USER_URL = '/api/users/me';
  static UPDATE_USER_URL = '/api/users/me';
  static MAKE_ADMIN_URL = '/api/users/make-admin';
  static MAKE_LAWYER_URL = '/api/users/make-lawyer';

  public async getLoggedInUser(): Promise<GetLoggedInUserAPIResponse> {
    return axiosService
      .get(UsersAPIService.GET_LOGGED_IN_USER_URL)
      .then((res) => res.data);
  }

  public async makeAdmin({
    email,
  }: MakeAdminAPIRequest): Promise<MakeAdminAPIResponse> {
    return axiosService
      .post(UsersAPIService.MAKE_ADMIN_URL, { email })
      .then((res) => res.data);
  }

  public async makeLawyer({
    email,
  }: MakeLawyerAPIRequest): Promise<MakeLawyerAPIResponse> {
    return axiosService
      .post(UsersAPIService.MAKE_LAWYER_URL, { email })
      .then((res) => res.data);
  }

  public async updateUser(
    data: UpdateUserAPIRequest,
  ): Promise<UpdateUserAPIResponse> {
    const payload = new FormData();

    if (data.name) {
      payload.append('name', data.name);
    }

    if (data.image) {
      payload.append('image', data.image);
    }

    if (data.password && data.password.length) {
      payload.append('password', data.password);
    }

    if (data.password2 && data.password2.length) {
      payload.append('password2', data.password2);
    }

    if (data.oldPassword && data.oldPassword.length) {
      payload.append('oldPassword', data.oldPassword);
    }

    if (data.motherName) {
      payload.append('motherName', data.motherName);
    }

    if (data.motherBirthDate) {
      payload.append('motherBirthDate', data.motherBirthDate.toISOString());
    }

    if (data.nationality) {
      payload.append('nationality', data.nationality);
    }

    if (typeof data.personalIdentifierType !== 'undefined') {
      payload.append(
        'personalIdentifierType',
        data.personalIdentifierType.toString(),
      );
    }

    if (data.personalIdentifier) {
      payload.append('personalIdentifier', data.personalIdentifier);
    }

    if (data.phoneNumber) {
      payload.append('phoneNumber', data.phoneNumber);
    }

    if (data.birthDate) {
      payload.append('birthDate', data.birthDate.toISOString());
    }

    if (data.birthPlace) {
      payload.append('birthPlace', data.birthPlace);
    }

    return axiosService
      .patch(UsersAPIService.UPDATE_USER_URL, payload)
      .then((res) => res.data);
  }
}

export { UsersAPIService };
