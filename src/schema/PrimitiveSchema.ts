export class PrimitiveSchema {
  private string: string;

  constructor(string: string) {
    this.string = string;
  }

  public getString(): string {
    return this.string;
  }

  public setString(string: string): void {
    this.string = string;
  }

  toString()  {
    return this.string
  }

  toJSON() {
    return this.string
  }

}

export enum PrimitiveSchemaType {
  STRING = "string", INT = "int", BOOLEAN = "boolean", FILE = "file", FLOAT = "float", DATE = "date"
}
