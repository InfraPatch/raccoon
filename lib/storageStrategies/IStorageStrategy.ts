interface ICreateParams {
  key: string;
  contents: Buffer;
  isPublic?: string;
}

export default interface IStorageStrategy {
  create(params: ICreateParams);
  get(key: string): Promise<Buffer>;
  getStream(key: string);
  exists(key: string): Promise<boolean>;
}
