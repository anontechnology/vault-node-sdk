package io.anontech.vizivault.dto;

import java.util.Date;
import java.util.List;

import lombok.Data;

@Data
public class DataPointElement {
  
  private String dataPointId;

  private String userId;

  private String attribute;

  private String sensitivity;

  private Object value;
  
  private List<String> regulations;

  //private String structureRootId;

  private Date createdDate;

  private Date modifiedDate;
  
}
