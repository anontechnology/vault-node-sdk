package io.anontech.vizivault;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import io.anontech.vizivault.dto.DataPointElement;
import lombok.Getter;
import lombok.Setter;

public class Entity {

  private Map<String, Object> attributes;

  private Set<String> changedAttributes;
  private Set<String> deletedAttributes;

  @SuppressWarnings("unchecked")
  public Entity(List<DataPointElement> data, String id) {
    this.id = id;

    changedAttributes = new HashSet<>();

    attributes = new HashMap<>();
    for(DataPointElement element : data) {
      if(attributes.containsKey(element.getAttribute())) {
        List<Object> repeatableValues;
        Object existingValue = attributes.get(element.getAttribute());
        if(existingValue instanceof List<?>) {
          repeatableValues = (List<Object>) existingValue;
        } else {
          repeatableValues = new ArrayList<>();
          attributes.put(element.getAttribute(), repeatableValues);
        }
        repeatableValues.add(element.getValue());
      } else {
        attributes.put(element.getAttribute(), element.getValue());
      }
    }
  }

  @Getter
  @Setter
  private String id;

  void purge() {
    attributes.clear();
  }

  void clearAttribute(String attributeKey) {
    attributes.remove(attributeKey);
  }

  Set<String> getChangedAttributes() {
    return changedAttributes;
  }

  Set<String> getDeletedAttributes() {
    return deletedAttributes;
  }

  public void setAttribute(String attributeKey, Object value) {
    attributes.put(attributeKey, value);
    changedAttributes.add(attributeKey);
  }

  public Object getAttribute(String attributeKey) {
    return attributes.get(attributeKey);
  }

  public void deleteAttribute(String attributeKey) {
    attributes.remove(attributeKey);
    deletedAttributes.add(attributeKey);
  }

  // some methods that would be nice to have:
  // see if an attribute has multiple values
  // get an attribute as a string
  // get an attribute as a list of strings
  // get an attribute as a list of objects

  // auto-create an attribute schema from an object might be useful? can copy LAVHA code for that

  // need to figure out how to represent "add this value" vs "overwrite this value" in the context of repeatable attributes
}
