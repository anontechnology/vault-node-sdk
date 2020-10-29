import { RegulationRule } from "./RegulationRule";

export class DisjunctiveRule extends RegulationRule {
  private constraints: Array<RegulationRule>;
  
  constructor(){
    super("any");
  }

  public addRule(rule: RegulationRule): void {
    this.constraints.push(rule);
  }
}
