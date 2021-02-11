import { RegulationRule } from "./RegulationRule";

export class AttributeRule extends RegulationRule {

  private operator?: AttributeListOperator;
  private attributes: Array<String>;

  constructor(attributes: Array<string>, operator: AttributeListOperator) {
    super("attribute");
    this.attributes = attributes;
    this.operator = operator;
  }

  public getOperator(): AttributeListOperator | undefined {
    return this.operator;
  }

  public getAttributes(): Array<String> {
    return this.attributes;
  }

  public setOperator(operator: AttributeListOperator): void {
    this.operator = operator;
  }

  public setAttributes(attributes: Array<String>): void {
    this.attributes = attributes;
  }
}

export enum AttributeListOperator {
  ANY = "any",
  NONE = "none"
}
