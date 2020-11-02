import { RegulationRule } from "./RegulationRule";

export class UserRule extends RegulationRule {
  private attribute: string;
  private value: string;
  private predicate: UserValuePredicate;

  constructor() {
    super("user");
  }

  public getAttribute(): string {
    return this.attribute;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public setAttribute(attribute: string): void {
    this.attribute = attribute;
  }

  public getPredicate(): UserValuePredicate {
    return this.predicate;
  }

  public setPredicate(predicate: UserValuePredicate): void {
    this.predicate = predicate;
  }
}

export enum UserValuePredicate {
  eq, neq, lt, gt, leq, geq, before, after
}