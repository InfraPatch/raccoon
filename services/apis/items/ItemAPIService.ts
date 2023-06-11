import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { Item } from '@/db/models/items/Item';

export interface NewItemAPIRequest {
  friendlyName: string;
  slug?: string;
  description: string;
}

export interface ItemWithSlugAPIRequest {
  slug: string;
}

export type GetItemAPIRequest = ItemWithSlugAPIRequest;
export interface GetItemAPIResponse extends APIResponse {
  item: Item;
}
export interface NewItemAPIResponse extends APIResponse, GetItemAPIResponse {}
export type UpdateItemAPIRequest = NewItemAPIRequest;
export type DeleteItemAPIRequest = ItemWithSlugAPIRequest;
export interface UpdateItemAPIResponse
  extends APIResponse,
    GetItemAPIResponse {}
export type DeleteItemAPIResponse = APIResponse;

export interface GetItemsAPIResponse extends APIResponse {
  items: Item[];
}

class ItemAPIService {
  static ITEMS_URL = '/api/items';
  static ITEM_URL = '/api/items/:slug';

  public async getItems(): Promise<GetItemsAPIResponse> {
    return axiosService.get(ItemAPIService.ITEMS_URL).then((res) => res.data);
  }

  public async getItem({
    slug,
  }: GetItemAPIRequest): Promise<GetItemAPIResponse> {
    const path = this.makeItemUrl(slug);
    return axiosService.get(path).then((res) => res.data);
  }

  public async newItem(data: NewItemAPIRequest): Promise<NewItemAPIResponse> {
    return axiosService
      .post(ItemAPIService.ITEMS_URL, data)
      .then((res) => res.data);
  }

  public async updateItem(
    slug: string,
    data: UpdateItemAPIRequest,
  ): Promise<UpdateItemAPIResponse> {
    const path = this.makeItemUrl(slug);
    return axiosService.patch(path, data).then((res) => res.data);
  }

  public async deleteItem({
    slug,
  }: DeleteItemAPIRequest): Promise<DeleteItemAPIResponse> {
    const path = this.makeItemUrl(slug);
    return axiosService.delete(path).then((res) => res.data);
  }

  private makeItemUrl(slug: string) {
    return ItemAPIService.ITEM_URL.replace(':slug', slug);
  }
}

export { ItemAPIService };
