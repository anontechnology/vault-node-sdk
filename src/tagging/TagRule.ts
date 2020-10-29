import { RegulationRule } from "./RegulationRule";

export class TagRule extends RegulationRule {

  private operator: TagListOperator;
  private attributes: Array<string>;
  
  constructor(){
    super("attribute");
    this.attributes = new Array();
  }
}

export enum TagListOperator {
  any, none, all
}
