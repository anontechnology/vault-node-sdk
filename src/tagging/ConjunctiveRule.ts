import { RegulationRule } from "./RegulationRule";

export class ConjunctiveRule extends RegulationRule {
  private constraints: Array<RegulationRule>;
  
  constructor(){
    super("all");
  }

  public addRule(rule: RegulationRule): void {
    this.constraints.push(rule);
  }
}
