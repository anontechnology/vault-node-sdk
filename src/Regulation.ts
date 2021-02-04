import { RegulationRule } from "./tagging/RegulationRule";
import {format} from "date-fns";

export class Regulation {
  private key?: string;
  private name?: string;
  private url?: string;
  private rule?: RegulationRule;
  private createdDate?: Date;
  private modifiedDate?: Date;

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

  public getKey(): string | undefined {
    return this.key;
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getName(): string | undefined {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getUrl(): string | undefined {
    return this.url;
  }

  public setUrl(url: string): void {
    this.url = url;
  }

  public getRule(): RegulationRule | undefined {
    return this.rule;
  }

  public setRule(rule: RegulationRule) {
    this.rule = rule;
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
