import { RegulationRule } from "./RegulationRule";

export class AttributeRule extends RegulationRule {

  private operator: AttributeListOperator;
  private attributes: Array<String>;

  constructor(){
    super("attribute");
    this.attributes = new Array();
  }
}

export enum AttributeListOperator {
  Any, None
}