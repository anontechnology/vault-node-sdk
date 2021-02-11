import {format} from "date-fns";

export class Tag {
  private name: string;
  private createdDate?: Date;
  private modifiedDate?: Date;

  public constructor(name: string) {
    this.name = name;
    this.createdDate = new Date();
    this.modifiedDate = new Date();

    // Override date formatting for JSON to be compatible with vault native format
    this.createdDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }
    this.modifiedDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
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
