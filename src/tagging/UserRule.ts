import { RegulationRule } from "./RegulationRule";

export class UserRule extends RegulationRule {
  private attribute?: string;
  private value?: string;
  private predicate?: UserValuePredicate;

  constructor(attribute: string, predicate: UserValuePredicate, value: string) {
    super("user");
    this.attribute = attribute;
    this.value = value
    this.predicate = predicate;
  }

  public getAttribute(): string | undefined {
    return this.attribute;
  }

  public setValue(value: string): void {
    this.value = value;
  }

  public getValue(): string | undefined {
    return this.value;
  }

  public setAttribute(attribute: string): void {
    this.attribute = attribute;
  }

  public getPredicate(): UserValuePredicate | undefined {
    return this.predicate;
  }

  public setPredicate(predicate: UserValuePredicate): void {
    this.predicate = predicate;
  }
}

export enum UserValuePredicate {
  EQUALS = "eq",
  NOT_EQUAL = "neq",
  LESS_THAN = "lt",
  GRATER_THAN = "gt",
  LESS_THAN_EQUAL_TO = "leq",
  GRATER_THAN_EQUAL_TO = "geq",
  BEFORE = "before",
  AFTER = "after"
}
