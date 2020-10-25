import { Attribute } from "./Attribute";

export class StorageRequest {
  public dataPoints: Array<Attribute>;
  public origin: string;

  public constructor(dataPoints) {
    this.dataPoints = dataPoints;
  }
}