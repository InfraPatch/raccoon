import axiosService, { APIResponse } from '@/services/axios';
import { IFilledContractAttachment } from '@/db/models/contracts/FilledContractAttachment';

export interface NewAttachmentAPIParams {
  friendlyName: string;
  file: File;
}

export interface NewFilledContractAttachmentAPIParams extends NewAttachmentAPIParams {
  filledContractId: number;
};

export interface GetFilledContractAttachmentAPIResponse extends APIResponse {
  FilledContractAttachment: IFilledContractAttachment;
};

export interface CreateFilledContractAttachmentAPIResponse extends GetFilledContractAttachmentAPIResponse {};
export interface DeleteFilledContractAttachmentAPIResponse extends APIResponse {};

const url = (template: string, id: number) => template.replace(':id', id.toString());

export class FilledContractAttachmentAPIService {
  static CREATE_FILLED_CONTRACT_ATTACHMENT_URL = '/api/filled-contracts/attachments';
  static GET_FILLED_CONTRACT_ATTACHMENT_URL = '/api/filled-contracts/attachments/:id';
  static DOWNLOAD_FILLED_CONTRACT_ATTACHMENT_URL = '/api/filled-contracts/attachments/:id/download';
  static DELETE_FILLED_CONTRACT_ATTACHMENT_URL = '/api/filled-contracts/attachments/:id';

  public async createFilledContractAttachment(data: NewFilledContractAttachmentAPIParams): Promise<CreateFilledContractAttachmentAPIResponse> {
    const payload = new FormData();

    if (data.filledContractId) {
      payload.append('filledContractId', data.filledContractId.toString());
    }

    if (data.friendlyName && data.friendlyName.length) {
      payload.append('friendlyName', data.friendlyName);
    }

    if (data.file) {
      payload.append('file', data.file);
    }

    return axiosService.post(FilledContractAttachmentAPIService.CREATE_FILLED_CONTRACT_ATTACHMENT_URL, payload)
      .then(res => res.data);
  }

  public async getFilledContractAttachment(id: number): Promise<GetFilledContractAttachmentAPIResponse> {
    return axiosService.get(url(FilledContractAttachmentAPIService.GET_FILLED_CONTRACT_ATTACHMENT_URL, id))
      .then(res => res.data);
  }

  public async deleteFilledContractAttachment(id: number): Promise<DeleteFilledContractAttachmentAPIResponse> {
    return axiosService.delete(url(FilledContractAttachmentAPIService.DELETE_FILLED_CONTRACT_ATTACHMENT_URL, id))
      .then(res => res.data);
  }
}
