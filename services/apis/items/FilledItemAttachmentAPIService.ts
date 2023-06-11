import axiosService, { APIResponse } from '@/services/axios';
import { IFilledItemAttachment } from '@/db/models/items/FilledItemAttachment';
import { NewAttachmentAPIParams } from '../contracts/FilledContractAttachmentAPIService';

export interface NewFilledItemAttachmentAPIParams
  extends NewAttachmentAPIParams {
  filledItemId: number;
}

export interface GetFilledItemAttachmentAPIResponse extends APIResponse {
  FilledItemAttachment: IFilledItemAttachment;
}

export type CreateFilledItemAttachmentAPIResponse =
  GetFilledItemAttachmentAPIResponse;
export type DeleteFilledItemAttachmentAPIResponse = APIResponse;

const url = (template: string, id: number) =>
  template.replace(':id', id.toString());

export class FilledItemAttachmentAPIService {
  static CREATE_FILLED_ITEM_ATTACHMENT_URL = '/api/filled-items/attachments';
  static GET_FILLED_ITEM_ATTACHMENT_URL = '/api/filled-items/attachments/:id';
  static DOWNLOAD_FILLED_ITEM_ATTACHMENT_URL =
    '/api/filled-items/attachments/:id/download';
  static DELETE_FILLED_ITEM_ATTACHMENT_URL =
    '/api/filled-items/attachments/:id';

  public async createFilledItemAttachment(
    data: NewFilledItemAttachmentAPIParams,
  ): Promise<CreateFilledItemAttachmentAPIResponse> {
    const payload = new FormData();

    if (data.filledItemId) {
      payload.append('filledItemId', data.filledItemId.toString());
    }

    if (data.friendlyName && data.friendlyName.length) {
      payload.append('friendlyName', data.friendlyName);
    }

    if (data.file) {
      payload.append('file', data.file);
    }

    return axiosService
      .post(
        FilledItemAttachmentAPIService.CREATE_FILLED_ITEM_ATTACHMENT_URL,
        payload,
      )
      .then((res) => res.data);
  }

  public async getFilledItemAttachment(
    id: number,
  ): Promise<GetFilledItemAttachmentAPIResponse> {
    return axiosService
      .get(
        url(FilledItemAttachmentAPIService.GET_FILLED_ITEM_ATTACHMENT_URL, id),
      )
      .then((res) => res.data);
  }

  public async deleteFilledItemAttachment(
    id: number,
  ): Promise<DeleteFilledItemAttachmentAPIResponse> {
    return axiosService
      .delete(
        url(
          FilledItemAttachmentAPIService.DELETE_FILLED_ITEM_ATTACHMENT_URL,
          id,
        ),
      )
      .then((res) => res.data);
  }
}
