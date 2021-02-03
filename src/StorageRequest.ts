import { Attribute } from "./Attribute";

export class StorageRequest {
  public data: Array<Attribute>;
  public origin?: string | undefined;

  public constructor(dataPoints: Array<Attribute>) {
    this.data = dataPoints;
  }
}
