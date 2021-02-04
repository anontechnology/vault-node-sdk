import { RegulationRule } from "./RegulationRule";

export class TagRule extends RegulationRule {

  private operator?: TagListOperator;
  private attributes: Array<string>;

  constructor(){
    super("attribute");
    this.attributes = new Array();
  }

  public getOperator(): TagListOperator | undefined {
    return this.operator;
  }

  public setOperator(attributes: Array<string>): void {
    this.attributes = attributes;
  }

  public setAttributes(operator: TagListOperator): void {
    this.operator = operator;
  }

  public getAttributes(): Array<string> {
    return this.attributes;
  }
}

export enum TagListOperator {
  any, none, all
}
