import { Entity } from "./Entity";
import { Attribute } from "./Attribute";

export class User extends Entity {
  public constructor(id: string) {
    super(id);
  }
}
