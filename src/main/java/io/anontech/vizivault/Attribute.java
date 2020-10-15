package io.anontech.vizivault;

import java.util.Date;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonElement;

import lombok.Data;

@Data
public class Attribute {

  private static Gson gson = new Gson();
  
  private String dataPointId;

  private String userId;

  private String attribute;

  private String sensitivity;

  private Object value;
  
  private List<String> regulations;

  private Date createdDate;

  private Date modifiedDate;

  public <T> T getValueAs(Class<T> valueClass) {
    return null; 
    // TODO figure out what Gson defaults to ... might have to coerce to jsonelement when reading?
  }
  
}
