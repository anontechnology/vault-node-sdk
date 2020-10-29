export class Tag {
  name: string;
  createdDate: Date;
  modifiedDate: Date;

  public constructor(name: string) {
    if (this.name === undefined) { this.name = null; }
    if (this.createdDate === undefined) { this.createdDate = null; }
    if (this.modifiedDate === undefined) { this.modifiedDate = null; }
    this.name = name;
  }
}
