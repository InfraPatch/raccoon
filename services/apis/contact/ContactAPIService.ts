import { IContactFormFields } from '@/components/contact-form/IContactFormFields';

import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

export interface ContactAPIResponse extends APIResponse {};

export interface ContactAPIRequest extends IContactFormFields {};

class ContactAPIService {
  static CONTACT_URL = '/api/contact';

  public async sendEmail(data: ContactAPIRequest): Promise<ContactAPIResponse> {
    return axiosService.post(ContactAPIService.CONTACT_URL, data)
      .then(res => res.data);
  }
}

export {
  ContactAPIService
};
