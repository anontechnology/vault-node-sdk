import { RegulationRule } from "./RegulationRule";

export class UserRule extends RegulationRule {
  private attribute: string;
  private value: string;
  private predicate: UserValuePredicate;

  constructor(){
    super("user");
  }
}

export enum UserValuePredicate {
  eq, neq, lt, gt, leq, geq, before, after
}