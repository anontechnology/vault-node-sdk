import { PrimitiveSchema, PrimitiveSchemaType } from "./schema/PrimitiveSchema";

export class AttributeDefinition {
  private key: string;
  private name: string;
  private hint: string;
  private repeatable: boolean;
  private indexed: boolean;
  private createdDate?: Date;
  private modifiedDate?: Date;
  private tags: Array<string>;
  private schema: any;

  constructor(name: string) {
    this.key = name;
    this.name = name;
    this.hint = "";
    this.repeatable = false;
    this.indexed = false;
    this.tags = new Array();
    this.setSchema(PrimitiveSchemaType.STRING);
  }

  public setSchema(schema: PrimitiveSchemaType) {
    this.schema = schema;
  }

  public getSchema(): any {
    return this.schema;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string) {
    this.name = name;
    this.key = name;
  }

  public getKey(): string {
    return this.key;
  }

  public setKey(key: string) {
    this.key = key;
  }

  public getHint(): string {
    return this.hint;
  }

  public setHint(hint: string) {
    this.hint = hint;
  }

  public getRepeatable(): boolean {
    return this.repeatable;
  }

  public setRepeatable(repeatable: boolean) {
    this.repeatable = repeatable;
  }

  public getIndexed(): boolean {
    return this.indexed;
  }

  public setIndexed(indexed: boolean) {
    this.indexed = indexed;
  }
}
