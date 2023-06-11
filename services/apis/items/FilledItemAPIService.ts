import axiosService, { APIResponse } from '@/services/axios';
import { IFilledItem } from '@/db/models/items/FilledItem';

export interface FilledOption {
  id: number;
  value: string;
}

export interface NewFilledItemAPIParams {
  friendlyName: string;
  itemSlug: string;
  options: FilledOption[];
}

export interface FilledItemOptionAPIParams {
  options: FilledOption[];
}

export interface UpdateFilledItemAPIRequest extends FilledItemOptionAPIParams {
  friendlyName: string;
}

export interface ListFilledItemsAPIResponse extends APIResponse {
  filledItems: IFilledItem[];
}

export interface CreateFilledItemAPIResponse extends APIResponse {
  filledItem: IFilledItem;
}

export interface GetFilledItemAPIResponse extends APIResponse {
  filledItem: IFilledItem;
}

export interface UpdateFilledItemAPIResponse extends APIResponse {
  filledItem: IFilledItem;
}

export type DeleteFilledItemAPIResponse = APIResponse;

class FilledItemAPIService {
  static LIST_FILLED_ITEMS_URL = '/api/filled-items/list/:slug';
  static FILLED_ITEMS_URL = '/api/filled-items';
  static FILLED_ITEM_URL = '/api/filled-items/:id';

  public async listFilledItems(
    slug: string,
  ): Promise<ListFilledItemsAPIResponse> {
    const path = this.buildListFilledItemsUrl(slug);
    return axiosService.get(path).then((res) => res.data);
  }

  public async getFilledItem(id: number): Promise<GetFilledItemAPIResponse> {
    const path = this.buildFilledItemsUrl(id);
    return axiosService.get(path).then((res) => res.data);
  }

  public async createFilledItem(
    payload: NewFilledItemAPIParams,
  ): Promise<CreateFilledItemAPIResponse> {
    return axiosService
      .post(FilledItemAPIService.FILLED_ITEMS_URL, payload)
      .then((res) => res.data);
  }

  public async updateFilledItem(
    id: number,
    payload: UpdateFilledItemAPIRequest,
  ): Promise<UpdateFilledItemAPIResponse> {
    const path = this.buildFilledItemsUrl(id);
    return axiosService.patch(path, payload).then((res) => res.data);
  }

  public async deleteFilledItem(
    id: number,
  ): Promise<DeleteFilledItemAPIResponse> {
    const path = this.buildFilledItemsUrl(id);
    return axiosService.delete(path).then((res) => res.data);
  }

  private buildListFilledItemsUrl(slug: string) {
    return FilledItemAPIService.LIST_FILLED_ITEMS_URL.replace(':slug', slug);
  }

  private buildFilledItemsUrl(id: number) {
    return FilledItemAPIService.FILLED_ITEM_URL.replace(':id', id.toString());
  }
}

export { FilledItemAPIService };
