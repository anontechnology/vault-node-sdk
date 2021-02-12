import { Attribute } from "./Attribute";
import {ValueException} from "./ValueException";
import {DataIntegrityException} from "./DataIntegrityException";

export class Entity {
  private attributes: Map<string, Attribute>;
  private repeatedAttributes: any;
  private changedAttributes: Array<Attribute>;
  private deletedAttributes: Array<string>;
  private id: string;
  private tags: Array<string>;
  private created?: Date;
  private updated?: Date;


  public constructor(id: string) {
    this.id = id;
    this.changedAttributes = [];
    this.attributes = new Map();
    this.repeatedAttributes = new Map<string, Array<Attribute>>();
    this.deletedAttributes = new Array();
    this.tags = new Array();
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
    this.repeatedAttributes.delete(attributeKey);
    this.deletedAttributes.push(attributeKey);
  }

  getChangedAttributes(): Array<Attribute> {
    return this.changedAttributes;
  }

  setChangedAttributes(changedAttributes: Array<Attribute>): void {
    this.changedAttributes = changedAttributes;
  }

  getDeletedAttributes(): Array<string> {
    return this.deletedAttributes;
  }

  setDeletedAttributes(deletedAttributes: Array<string>): void {
    this.deletedAttributes = deletedAttributes;
  }

  addAttribute(attribute: any, value: any|undefined = undefined): void {
    if (typeof attribute === "string") {
      let new_attribute = new Attribute();
      new_attribute.setAttribute(attribute);
      if (value != undefined) {
        new_attribute.setValue(value);
      }
      this._addAttribute(new_attribute);
    }
    else if ( typeof attribute === "object") {
      if (value != undefined) {
        attribute.setValue(value);
      }
      this._addAttribute(attribute)
    }
    else {
      throw new ValueException("Add attribute accepts an attribute name [string] and value [any] pair or an Attribute [object]")
    }
  }


  private _addAttribute(attribute: Attribute): void {
    this.addAttributeWithoutPendingChange(attribute);
    this.changedAttributes.push(attribute);
  }

  addAttributeWithoutPendingChange(attribute: Attribute): void {
    let attributeKey = attribute.getAttribute();
    if (this.repeatedAttributes.has(attributeKey)) {
      this.repeatedAttributes.get(attributeKey).push(attribute);
    } else if(this.attributes.has(attributeKey)) {
      let repeatableValues = new Array();
      repeatableValues.push(this.attributes.get(attributeKey));
      repeatableValues.push(attribute);
      this.attributes.delete(attributeKey);
      this.repeatedAttributes.set(attributeKey, repeatableValues);
    } else {
      this.attributes.set(attributeKey, attribute);
    }
  }

  public buildAttribute(attributeKey: string, value: any) {
    let attribute = new Attribute();
    attribute.setAttribute(attributeKey);
    attribute.setValue(value);

    this.setAttribute(attribute);
  }

  public setAttribute(attribute: Attribute) {
    this.addAttributeWithoutPendingChange(attribute);
    this.changedAttributes.push(attribute);
  }

  public getAttribute (attributeKey: string): Attribute|undefined {
    if (this.repeatedAttributes.has(attributeKey)) {
      if (this.repeatedAttributes.get(attributeKey).size() == 1) {
        return this.repeatedAttributes.get(attributeKey)[0] as Attribute;
      } else {
        throw new DataIntegrityException("Attribute " + attributeKey +  " has more than one value but only one can be legally returned from get Attribute");
      }
    } else if (this.attributes.has(attributeKey)) {
      return this.attributes.get(attributeKey) as Attribute;
    } else {
      return undefined
    }
  }

  public getAttributes(attributeKey: string|undefined = undefined): Array<Attribute> {
    if (attributeKey == null) {
      let  flattenedRepeatedAttributes = [].concat.apply([], (Array.from(this.repeatedAttributes.values())) as Array<any> );
      return Array.from(this.attributes.values()).concat(flattenedRepeatedAttributes);
    }
    else {
      if (this.attributes.has(attributeKey)) {
        if (this.attributes.get(attributeKey) == null)
          return new Array();
        else {
          return new Array(this.attributes.get(attributeKey) as Attribute);
        }
      } else {
        return this.repeatedAttributes.get(attributeKey);
      }
    }
  }

  public deleteAttribute(attributeKey: string) {
    this.attributes.delete(attributeKey);
    this.deletedAttributes.push(attributeKey);
  }
}

