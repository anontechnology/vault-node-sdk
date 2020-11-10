import { RegulationRule } from "./tagging/RegulationRule";

export class Regulation {
  private key: string;
  private name: string;
  private url: string;
  private rule?: RegulationRule;
  private createdDate?: Date;
  private modifiedDate?: Date;

  public constructor() {
    this.key = "";
    this.name = "";
    this.url = "";
  }

  public getKey(): string {
    return this.key;
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getCreatedDate(): Date | undefined {
    return this.createdDate;
  }

  public setCreatedDate(createdDate: Date): void {
    this.createdDate = createdDate;
  }

  public getModifiedDate(): Date | undefined {
    return this.modifiedDate;
  }

  public setModifiedDate(modifiedDate: Date): void {
    this.modifiedDate = modifiedDate;
  }
}
