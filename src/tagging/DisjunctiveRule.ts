import { RegulationRule } from "./RegulationRule";

export class DisjunctiveRule extends RegulationRule {
  private constraints: Array<RegulationRule>;

  constructor() {
    super("any");
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
