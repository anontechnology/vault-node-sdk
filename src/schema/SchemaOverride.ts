import { PrimitiveSchema } from "./PrimitiveSchema";

export interface SchemaOverride {
  value(): PrimitiveSchema;
}
