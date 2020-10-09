package io.anontech.vizivault.model;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import io.anontech.vizivault.dto.DataPointElement;

public class Entity {

  private Map<String, Object> attributes;

  private Set<String> changedAttributes;

  @SuppressWarnings("unchecked")
  public Entity(List<DataPointElement> data) {
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

  public void setAttribute(String attributeKey, Object value) {
    attributes.put(attributeKey, value);
    changedAttributes.add(attributeKey);
  }

  public Object getAttribute(String attributeKey) {
    return attributes.get(attributeKey);
  }

  // some methods that would be nice to have:
  // see if an attribute has multiple values
  // get an attribute as a string
  // get an attribute as a list of strings
  // get an attribute as a list of objects

  // auto-create an attribute schema from an object might be useful? can copy LAVHA code for that

  // need to figure out how to represent "add this value" vs "overwrite this value" in the context of repeatable attributes
}
