import { PrimitiveSchemaType } from "./schema/PrimitiveSchema";


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
    this.tags = [];

    // The default schema is string
    this.setSchema(PrimitiveSchemaType.STRING);
  }

  public setSchema(schema: PrimitiveSchemaType): void {
    this.schema = schema;
  }

  public getSchema(): any {
    return this.schema;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
    this.key = name;
  }

  public getKey(): string {
    return this.key;
  }

  public setKey(key: string): void {
    this.key = key;
  }

  public getHint(): string {
    return this.hint;
  }

  public setHint(hint: string): void {
    this.hint = hint;
  }

  public getRepeatable(): boolean {
    return this.repeatable;
  }

  public setRepeatable(repeatable: boolean): void {
    this.repeatable = repeatable;
  }

  public getIndexed(): boolean {
    return this.indexed;
  }

  public setIndexed(indexed: boolean): void {
    this.indexed = indexed;
  }

  public getCreatedDate(): Date | undefined {
    return this.createdDate;
  }

  public setCreatedDate(createdDate: Date): void {
    this.createdDate = createdDate;
  }

  public getModifiedDate(): Date | undefined {
    return this.modifiedDate;
  }

  public setModifiedDate(modifiedDate: Date): void {
    this.modifiedDate = modifiedDate;
  }

  public getTags(): Array<string> {
    return this.tags;
  }

  public setTags(tags: Array<string>) {
    this.tags = tags;
  }
}
