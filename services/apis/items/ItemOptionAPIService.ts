import axiosService from '@/services/axios';
import { APIResponse } from '@/services/axios';

import { ItemOption } from '@/db/models/items/ItemOption';
import { OptionType } from '@/db/common/OptionType';

export interface ItemOptionAPIType {
  type: OptionType;
  priority: number;
  friendlyName: string;
  longDescription?: string;
  hint?: string;
  replacementString?: string;
  minimumValue?: number;
  maximumValue?: number;
}

export interface ItemOptionWithIdAPIRequest {
  id: number;
}

export interface NewItemOptionAPIRequest extends ItemOptionAPIType {
  itemId: number;
}
export interface NewItemOptionAPIResponse extends APIResponse {
  option: ItemOption;
}

export type GetItemOptionsAPIRequest = ItemOptionWithIdAPIRequest;
export type GetItemOptionAPIRequest = ItemOptionWithIdAPIRequest;

export interface GetItemOptionsAPIResponse extends APIResponse {
  options: ItemOption[];
}
export interface GetItemOptionAPIResponse extends APIResponse {
  option: ItemOption;
}

export type DeleteItemOptionAPIRequest = ItemOptionWithIdAPIRequest;
export interface UpdateItemOptionAPIRequest
  extends NewItemOptionAPIRequest,
    ItemOptionWithIdAPIRequest {}
export type UpdateItemOptionAPIResponse = APIResponse;
export type DeleteItemOptionAPIResponse = APIResponse;

class ItemOptionAPIService {
  static ITEM_OPTIONS_URL = '/api/item-options';
  static ITEM_OPTION_URL = '/api/item-options/:id';

  public async newItemOption(
    data: NewItemOptionAPIRequest,
  ): Promise<NewItemOptionAPIResponse> {
    return axiosService
      .post(ItemOptionAPIService.ITEM_OPTIONS_URL, data)
      .then((res) => res.data);
  }

  public async updateItemOption(
    data: UpdateItemOptionAPIRequest,
  ): Promise<UpdateItemOptionAPIResponse> {
    const { id } = data;
    const path = this.makeItemOptionUrl(id);

    return axiosService.patch(path, data).then((res) => res.data);
  }

  public async getItemOptions(
    data: GetItemOptionsAPIRequest,
  ): Promise<GetItemOptionsAPIResponse> {
    return axiosService
      .get(ItemOptionAPIService.ITEM_OPTIONS_URL)
      .then((res) => res.data);
  }

  public async getItemOption({
    id,
  }: GetItemOptionAPIRequest): Promise<GetItemOptionAPIResponse> {
    const path = this.makeItemOptionUrl(id);

    return axiosService.get(path).then((res) => res.data);
  }

  public async deleteItemOption({
    id,
  }: DeleteItemOptionAPIRequest): Promise<DeleteItemOptionAPIResponse> {
    const path = this.makeItemOptionUrl(id);

    return axiosService.delete(path).then((res) => res.data);
  }

  private makeItemOptionUrl(id: number): string {
    return ItemOptionAPIService.ITEM_OPTION_URL.replace(':id', id.toString());
  }
}

export { ItemOptionAPIService };
