package io.anontech.vizivault;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Date;
import java.util.List;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonPrimitive;

import io.anontech.vizivault.schema.PrimitiveSchema;
import io.anontech.vizivault.schema.SchemaIgnore;
import io.anontech.vizivault.schema.SchemaOverride;
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

  public void setSchema(PrimitiveSchema schema) {
    this.schema = schema;
  }

  private void addFieldSchema(JsonObject schemaObject, Field f) {    
    Annotation[] annotations = f.getAnnotations();
    for(Annotation a : annotations) {
      if(a instanceof SchemaIgnore) {
        return;
      } else if(a instanceof SchemaOverride) {
        schemaObject.addProperty(f.getName(), ((SchemaOverride)a).value().toString());
        return;
      }
    }
    if(f.getClass().isArray()){
      schemaObject.add('['+f.getName()+']', constructSchema(f.getClass().getComponentType()));
    } else {
      Type fieldType = f.getGenericType();
      if(fieldType instanceof ParameterizedType && ((ParameterizedType) fieldType).getRawType().equals(List.class)) {
        Type listElementType = ((ParameterizedType) fieldType).getActualTypeArguments()[0];
        schemaObject.add('['+f.getName()+']', constructSchema(listElementType));
      } else {
        schemaObject.add(f.getName(), constructSchema(f.getType()));
      }
    }
  }

  private JsonElement constructSchema(Type type) {
    if(type.equals(String.class)) return new JsonPrimitive("string");
    else if(type.equals(Date.class)) return new JsonPrimitive("date");
    else if(type.equals(Integer.class)) return new JsonPrimitive("int"); // TODO handle all integral types - byte, short, int, long
    else if(type.equals(Double.class) || type.equals(Float.class)) return new JsonPrimitive("float");
    else if(type.equals(Boolean.class)) return new JsonPrimitive("boolean");
    else if(!(type instanceof Class)) return new JsonPrimitive(type.getTypeName());
    
    Class<?> typeClass = (Class<?>) type;

    if(typeClass.isEnum()) return new JsonPrimitive("string");

    JsonObject schemaObject = new JsonObject();

    while(!typeClass.equals(Object.class)) {
      for(Field f : typeClass.getDeclaredFields()){

        addFieldSchema(schemaObject, f);

      }
      typeClass = typeClass.getSuperclass();
    }
    
    return schemaObject;
  }

  public void schemaFromClass(Class<?> schemaClass) {
    this.schema = constructSchema(schemaClass);
  }

  public void setSchema(JsonObject jsonSchema) {
    // Lots of validation here
  }

  // subattribute builder...?
  // okay yeah we don't do the arbitrary setSchema, probably, instead there's methods for constructing a schema
}
