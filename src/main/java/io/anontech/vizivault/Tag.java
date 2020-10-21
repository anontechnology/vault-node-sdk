package io.anontech.vizivault;

import java.util.Date;

import lombok.Data;

@Data
public class Tag {
  private String name;

  private Date createdDate;
  private Date modifiedDate;
}
