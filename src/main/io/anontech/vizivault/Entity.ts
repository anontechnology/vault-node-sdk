import { Attribute } from "./Attribute";

export class Entity {
  attributes: Map<string, Attribute>;
  repeatedAttributes: Map<string, Array<Attribute>>;
  changedAttributes: Array<Attribute>;
  deletedAttributes: Array<string>;
  id: string;
  tags: Array<string>;

  public constructor(data: Array<Attribute>, id: string) {
    if (this.attributes === undefined) { this.attributes = null; }
    if (this.repeatedAttributes === undefined) { this.repeatedAttributes = null; }
    if (this.changedAttributes === undefined) { this.changedAttributes = null; }
    if (this.deletedAttributes === undefined) { this.deletedAttributes = null; }
    if (this.id === undefined) { this.id = null; }
    if (this.tags === undefined) { this.tags = null; }
    this.id = id;
    this.changedAttributes = [];
    this.attributes = new Map();

    data.forEach((element) => {
      const attributeKey = element.attribute;
      if (this.attributes.has(attributeKey)){
        let repeatableValues: Array<Attribute>;
        if (this.repeatedAttributes.has(attributeKey)){
          repeatableValues = this.repeatedAttributes.get(attributeKey);
        } else {
          repeatableValues = [];
          this.repeatedAttributes.set(attributeKey, repeatableValues);
        }
        repeatableValues.push(element);
      } else {
        this.attributes.set(attributeKey, element);
      }
    });
  }

  purge() {
    this.attributes.clear();
  }

  clearAttribute(attributeKey: string) {
    this.attributes.delete(attributeKey);
  }

  getChangedAttributes(): Array<Attribute> {
    return this.changedAttributes;
  }

  getDeletedAttributes(): Array<string> {
    return this.deletedAttributes;
  }

  public buildAttribute(attributeKey: string, value: any) {
    let attribute = new Attribute();
    attribute.attribute = attributeKey;
    attribute.value = value;

    this.setAttribute(attribute);
  }

  public setAttribute(attribute: Attribute) {
    const attributeKey = attribute.attribute;
    if(this.repeatedAttributes.has(attributeKey)){
      this.repeatedAttributes.get(attributeKey).push(attribute);
    } else {
      this.attributes.set(attributeKey, attribute);
    }
    this.changedAttributes.push(attribute);
  }

  public getAttribute(attributeKey: string): Array<Attribute> {
    if (this.attributes.has(attributeKey)) {
      return new Array(this.attributes.get(attributeKey));
    } else {
      return this.repeatedAttributes.get(attributeKey);
    }
  }

  public getAttributes(): Array<Attribute> {
    return Array.from(this.attributes.values());
  }

  public deleteAttribute(attributeKey: string) {
    this.attributes.delete(attributeKey);
    this.deletedAttributes.push(attributeKey);
  }
}

