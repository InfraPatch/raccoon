import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { Item } from '@/db/models/items/Item';

export interface NewItemAPIRequest {
  friendlyName: string;
  slug?: string;
  description: string;
};

export interface ItemWithIdAPIRequest {
  id: number;
};

export interface GetItemAPIRequest extends ItemWithIdAPIRequest {};
export interface GetItemAPIResponse extends APIResponse {
  item: Item;
};
export interface NewItemAPIResponse extends APIResponse, GetItemAPIResponse {};
export interface UpdateItemAPIRequest extends NewItemAPIRequest { };
export interface DeleteItemAPIRequest extends ItemWithIdAPIRequest {};
export interface UpdateItemAPIResponse extends APIResponse, GetItemAPIResponse {};
export interface DeleteItemAPIResponse extends APIResponse {};

export interface GetItemsAPIResponse extends APIResponse {
  items: Item[];
};

class ItemAPIService {
  static ITEMS_URL = '/api/items';
  static ITEM_URL = '/api/items/:id';

  public async getItems(): Promise<GetItemsAPIResponse> {
    return axiosService.get(ItemAPIService.ITEMS_URL)
      .then(res => res.data);
  }

  public async getItem({ id }: GetItemAPIRequest): Promise<GetItemAPIResponse> {
    const path = this.makeItemUrl(id);
    return axiosService.get(path).then(res => res.data);
  }

  public async newItem(data: NewItemAPIRequest): Promise<NewItemAPIResponse> {
    return axiosService.post(ItemAPIService.ITEMS_URL, data)
      .then(res => res.data);
  }

  public async updateItem(id: number, data: UpdateItemAPIRequest): Promise<UpdateItemAPIResponse> {
    const path = this.makeItemUrl(id);
    return axiosService.patch(path, data).then(res => res.data);
  }

  public async deleteItem({ id }: DeleteItemAPIRequest): Promise<DeleteItemAPIResponse> {
    const path = this.makeItemUrl(id);
    return axiosService.delete(path).then(res => res.data);
  }

  private makeItemUrl(id: number) {
    return ItemAPIService.ITEM_URL.replace(':id', id.toString());
  }
}

export {
  ItemAPIService
};
