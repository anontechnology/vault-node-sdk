import { RegulationRule } from "./tagging/RegulationRule";
import {format} from "date-fns";

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

    // Override date formatting for JSON to be compatible with vault native format
    this.createdDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }
    this.modifiedDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }
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
