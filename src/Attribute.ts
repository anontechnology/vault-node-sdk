export class Attribute {
  private dataPointId: string | undefined;
  private userId: string;
  private attribute: string;
  private sensitivity?: string | undefined;
  private value: any;
  private regulations: Array<string>;
  private tags: Array<string>;
  private createdDate?: Date;
  private modifiedDate?: Date;

  constructor(attributeDefinitionName: undefined|string = undefined ) {
    this.regulations = new Array();
    this.tags = new Array();
    this.userId = "";
    this.attribute = "";

    if (attributeDefinitionName != undefined) {
      this.attribute = attributeDefinitionName;
    }

  }

  public getRegulations(): Array<string> {
    return this.regulations;
  }

  public setRegulations(regulations: Array<string>): void {
    this.regulations = regulations;
  }

  public getTags(): Array<string> {
    return this.tags;
  }

  public setTags(tags: Array<string>): void {
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
    return <string> this.sensitivity;
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

  public withAttribute(attribute: string): Attribute {
    this.attribute = attribute;
    return this;
  }

  public getDataPointId(): string | undefined {
    return this.dataPointId;
  }

  public withValue(value: string): Attribute {
    this.value = value;
    return this;
  }


}
