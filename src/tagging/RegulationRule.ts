export abstract class RegulationRule {
  private type: string;

  constructor(type: string) {
    this.type = type;
  }

  public getType(): string {
    return this.type;
  }

  public setType(type: string): void {
    this.type = type;
  }
}
