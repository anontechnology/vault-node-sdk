import { Attribute } from "./Attribute";

export class Entity {
  private attributes: Map<string, Attribute>;
  private repeatedAttributes: any;
  private changedAttributes: Array<Attribute>;
  private deletedAttributes: Array<string>;
  private id: string;
  private tags: Array<string>;

  public constructor(data: Array<Attribute>, id: string) {
    this.id = id;
    this.changedAttributes = [];
    this.attributes = new Map();
    this.repeatedAttributes = new Map<string, Array<Attribute>>();
    this.deletedAttributes = new Array();
    this.tags = new Array();

    data.forEach((element) => {
      const attributeKey = element.getAttribute();
      if (this.attributes.has(attributeKey)){
        let repeatableValues: any = new Array<Attribute>();
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

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getTags(): Array<string> {
    return this.tags;
  }

  public setTags(tags: Array<string>): void {
    this.tags = tags;
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

  clearDeletedAttributes() {
    this.deletedAttributes = new Array();
  }

  clearChangedAttributes() {
    this.changedAttributes = new Array();
  }

  public buildAttribute(attributeKey: string, value: any) {
    let attribute = new Attribute();
    attribute.setAttribute(attributeKey);
    attribute.setValue(value);

    this.setAttribute(attribute);
  }

  public setAttributeWithoutPendingChange( attribute: Attribute) {
    const attributeKey = attribute.getAttribute();
    if(this.repeatedAttributes.has(attributeKey)){
      this.repeatedAttributes.get(attributeKey).push(attribute);
    }
    else if(this.attributes.has(attributeKey))  {
      let repeatableValues = [this.attributes.get(attributeKey), attribute ];
      this.attributes.delete(attributeKey);
      this.repeatedAttributes.set(attributeKey, repeatableValues);
    }
    else {
      this.attributes.set(attributeKey, attribute);
    }
  }

  public setAttribute(attribute: Attribute) {
    this.setAttributeWithoutPendingChange(attribute);
    this.changedAttributes.push(attribute);
  }

  public getAttribute(attributeKey: string): any {
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

