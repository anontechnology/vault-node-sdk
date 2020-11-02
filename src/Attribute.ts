import { Tag } from "./Tag";

export class Attribute {
  private dataPointId: string;
  private userId: string;
  private attribute: string;
  private sensitivity: string;
  private value: any;
  private regulations: Array<string>;
  private tags: Array<Tag>;
  private createdDate: Date;
  private modifiedDate: Date;

  constructor() {
    this.regulations = new Array();
    this.tags = new Array();
    this.createdDate = new Date();
    this.modifiedDate = new Date();
    this.dataPointId = "";
    this.userId = "";
    this.attribute = "";
    this.sensitivity = "";
  }

  public getDataPointId(): string {
    return this.dataPointId;
  }

  public setDataPointId(dataPointId: string): void {
    this.dataPointId = dataPointId;
  }

  public getRegulations(): Array<string> {
    return this.regulations;
  }

  public setRegulations(regulations: Array<string>): void {
    this.regulations = regulations;
  }

  public getTags(): Array<Tag> {
    return this.tags;
  }

  public setTags(tags: Array<Tag>): void {
    this.tags = tags;
  }

  public getUserId(): string {
    return this.userId;
  }

  public setValue(value: any): void {
    this.value = value;
  }

  public getValue(): any {
    return this.value;
  }

  public setUserId(userId: string): void {
    this.userId = userId;
  }

  public getSensitivity(): string {
    return this.sensitivity;
  }

  public setSensitivity(sensitivity: string): void {
    this.sensitivity = sensitivity;
  }

  public getAttribute(): string {
    return this.attribute;
  }

  public setAttribute(attribute: string): void {
    this.attribute = attribute;
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
