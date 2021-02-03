import { Entity } from "./Entity";
import { Attribute } from "./Attribute";

export class User extends Entity {
  public constructor(data: Array<Attribute>, id: string) {
    super(data, id);
  }


}
