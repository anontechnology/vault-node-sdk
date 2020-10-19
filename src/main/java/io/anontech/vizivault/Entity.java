package io.anontech.vizivault;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.Setter;

public class Entity {

  private Map<String, Attribute> attributes;
  private Map<String, List<Attribute>> repeatedAttributes;

  private Set<Attribute> changedAttributes;
  private Set<String> deletedAttributes;

  public Entity(List<Attribute> data, String id) {
    this.id = id;

    changedAttributes = new HashSet<>();

    attributes = new HashMap<>();
    for(Attribute element : data) {
      String attributeKey = element.getAttribute();
      if(attributes.containsKey(attributeKey)) {
        List<Attribute> repeatableValues;
        if(repeatedAttributes.containsKey(attributeKey)) {
          repeatableValues = repeatedAttributes.get(attributeKey);
        } else {
          repeatableValues = new ArrayList<>();
          repeatedAttributes.put(attributeKey, repeatableValues);
        }
        repeatableValues.add(element);
      } else {
        attributes.put(attributeKey, element);
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

  Set<Attribute> getChangedAttributes() {
    return changedAttributes;
  }

  Set<String> getDeletedAttributes() {
    return deletedAttributes;
  }

  public void setAttribute(String attributeKey, Object value) {
    Attribute attribute = new Attribute();
    attribute.setAttribute(attributeKey);
    attribute.setValue(value);

    setAttribute(attribute);
  }

  public void setAttribute(Attribute attribute) {
    String attributeKey = attribute.getAttribute();
    if(repeatedAttributes.containsKey(attributeKey)){
      repeatedAttributes.get(attributeKey).add(attribute);
    } else {
      attributes.put(attributeKey, attribute);
    }
    changedAttributes.add(attribute);
  }

  public List<Attribute> getAttribute(String attributeKey) {
    if(attributes.containsKey(attributeKey)) {
      return List.of(attributes.get(attributeKey));
    } else {
      return repeatedAttributes.get(attributeKey);
    }
  }

  public List<Attribute> getAttributes() {
    return attributes.values().stream().collect(Collectors.toList());
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
