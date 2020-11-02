export class Tag {
  private name: string;
  private createdDate: Date;
  private modifiedDate: Date;

  public constructor(name: string) {
    this.name = name;
    this.createdDate = new Date();
    this.modifiedDate = new Date();
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
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
