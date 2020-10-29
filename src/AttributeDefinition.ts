import { PrimitiveSchema } from "./schema/PrimitiveSchema";

export class AttributeDefinition {
  key: string;
  name: string;
  hint: string;
  repeatable: boolean;
  indexed: boolean;
  createdDate: Date;
  modifiedDate: Date;
  tags: Array<string>;
  schema: any;

  public setSchema(schema: PrimitiveSchema) {
    this.schema = schema;
  }

  public setName(name: string) {
    this.name = name;
    this.key = name;
  }

  constructor() {
    if (this.key === undefined) { this.key = null; }
    if (this.name === undefined) { this.name = null; }
    if (this.hint === undefined) { this.hint = null; }
    if (this.repeatable === undefined) { this.repeatable = false; }
    if (this.indexed === undefined) { this.indexed = false; }
    if (this.createdDate === undefined) { this.createdDate = null; }
    if (this.modifiedDate === undefined) { this.modifiedDate = null; }
    if (this.tags === undefined) { this.tags = null; }
    if (this.schema === undefined) { this.schema = null; }
  }
}
