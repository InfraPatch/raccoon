import axiosService, { APIResponse } from '@/services/axios';
import { IFilledItem } from '@/db/models/items/FilledItem';

export interface NewFilledItemAPIParams {
  friendlyName: string;
  itemId: number;
};

export interface FilledOption {
  id: number;
  value: string;
};

export interface FilledItemOptionAPIParams {
  options: FilledOption[];
};

export interface ListFilledItemsAPIResponse extends APIResponse {
  filledItems: IFilledItem[];
};

export interface CreateFilledItemAPIResponse extends APIResponse {
  filledItem: IFilledItem;
};

export interface GetFilledItemAPIResponse extends APIResponse {
  filledItem: IFilledItem;
};

export interface DeleteFilledItemAPIResponse extends APIResponse {};

class FilledItemAPIService {
  static FILLED_ITEMS_URL = '/api/inventory';
  static FILLED_ITEM_URL = '/api/inventory/:id';

  public async listFilledItems(): Promise<ListFilledItemsAPIResponse> {
    return axiosService.get(FilledItemAPIService.FILLED_ITEMS_URL)
      .then(res => res.data);
  }

  public async getFilledItem(id: number): Promise<GetFilledItemAPIResponse> {
    const path = this.buildFilledItemsUrl(id);
    return axiosService.get(path).then(res => res.data);
  }

  public async createFilledItem(payload: NewFilledItemAPIParams): Promise<CreateFilledItemAPIResponse> {
    return axiosService.post(FilledItemAPIService.FILLED_ITEMS_URL, payload)
      .then(res => res.data);
  }

  public async deleteFilledItem(id: number): Promise<DeleteFilledItemAPIResponse> {
    const path = this.buildFilledItemsUrl(id);
    return axiosService.delete(path).then(res => res.data);
  }

  private buildFilledItemsUrl(id: number) {
    return FilledItemAPIService.FILLED_ITEM_URL.replace(':id', id.toString());
  }
}

export {
  FilledItemAPIService
};
