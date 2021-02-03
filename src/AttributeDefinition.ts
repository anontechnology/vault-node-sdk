import { PrimitiveSchema } from "./schema/PrimitiveSchema";
import { format } from 'date-fns';

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
    this.key = ""
    this.name = "";
    this.hint = "";
    this.repeatable = false;
    this.indexed = false;
    this.tags = new Array();

    // Override date formatting for JSON to be compatible with vault native format
    this.createdDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }
    this.modifiedDate.toJSON = function() {return format(this, "yyyy-MM-dd'T'HH:mm:ssXXX") }

    // The default schema is string
    this.setSchema(new PrimitiveSchema("String"));
  }

  public setSchema(schema: PrimitiveSchema) {
    this.schema = schema;
  }

  public setRepeatable(repeatable: boolean) {
    this.repeatable = repeatable;
  }

  public setIndexed(indexed: boolean) {
    this.indexed = indexed;
  }

  public setHint(hint: string) {
    this.hint = hint;
  }

  public setName(name: string) {
    this.name = name;
    this.key = name;
  }

  public getName() {
    return this.name;
  }

}
