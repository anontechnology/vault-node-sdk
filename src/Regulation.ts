import { RegulationRule } from "./tagging/RegulationRule";

export class Regulation {
  private key: string;
  private name: string;
  private url: string;
  private rule?: RegulationRule;
  private createdDate: Date;
  private modifiedDate: Date;

  public constructor() {
    this.createdDate = new Date();
    this.modifiedDate = new Date();
    this.key = "";
    this.name = "";
    this.url = "";
  }

  public getCreatedDate(): Date {
    return this.createdDate;
  }

  public setCreatedDate(createdDate: Date): void {
    this.createdDate = createdDate;
  }

  public getModifiedDate(): Date {
    return this.modifiedDate;
  }

  public setModifiedDate(modifiedDate: Date): void {
    this.modifiedDate = modifiedDate;
  }
}
