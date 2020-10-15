package io.anontech.vizivault;

import java.util.Date;

import com.google.gson.JsonObject;

import lombok.AccessLevel;
import lombok.Data;
import lombok.Setter;

@Data
public class AttributeDefinition {
  
  private String key;
  private String name;
  private String hint;
  private boolean repeatable;
  private boolean indexed;
  private Date createdDate;
  private Date modifiedDate;

  @Setter(AccessLevel.NONE)
  private Object schema;

  public enum PrimitiveSchema {
    STRING, INTEGER, BOOLEAN, FILE
  }

  public void setSchema(PrimitiveSchema schema) {

  }

  public void schemaFromClass(Class<?> schemaClass) {

  }

  public void setSchema(JsonObject jsonSchema) {
    // Lots of validation here
  }

  // subattribute builder...?
  // okay yeah we don't do the arbitrary setSchema, probably, instead there's methods for constructing a schema
}
