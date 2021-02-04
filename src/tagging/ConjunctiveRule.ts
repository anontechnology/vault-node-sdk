import { RegulationRule } from "./RegulationRule";

export class ConjunctiveRule extends RegulationRule {
  private constraints: Array<RegulationRule>;

  constructor() {
    super("all");
    this.constraints = new Array();
  }

  public getConstraints(): Array<RegulationRule> {
    return this.constraints;
  }

  public setConstraints(constraints: Array<RegulationRule>): void {
    this.constraints = constraints;
  }

  public addRule(rule: RegulationRule): void {
    this.constraints.push(rule);
  }
}
