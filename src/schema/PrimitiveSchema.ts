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
}
