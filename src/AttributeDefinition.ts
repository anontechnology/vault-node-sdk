import { PrimitiveSchema } from "./schema/PrimitiveSchema";

export class AttributeDefinition {
  private key: string;
  private name: string;
  private hint: string;
  private repeatable: boolean;
  private indexed: boolean;
  private createdDate: Date;
  private modifiedDate: Date;
  private tags: Array<string>;
  private schema: any;

  constructor() {
    this.createdDate = new Date();
    this.modifiedDate = new Date();
    this.key = "";
    this.name = "";
    this.hint = "";
    this.repeatable = false;
    this.indexed = false;
    this.tags = new Array();
  }

  public setSchema(schema: PrimitiveSchema) {
    this.schema = schema;
  }

  public setName(name: string) {
    this.name = name;
    this.key = name;
  }
}
