import { Attribute } from "./Attribute";

export class StorageRequest {
  public data: Array<Attribute>;
  public origin?: string;

  public constructor(data: Array<Attribute>) {
    this.data = data;
  }
}
