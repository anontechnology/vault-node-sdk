import { Entity } from "./Entity";

export class EntityDefinition {
  public id: string;
  public tags: Array<string>;

  constructor(entity: Entity) {
    this.id = entity.getId();
    this.tags = entity.getTags();
  }
}