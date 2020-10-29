import { Tag } from "./Tag";

export class Attribute {
  dataPointId: string;
  userId: string;
  attribute: string;
  sensitivity: string;
  value: any;
  regulations: Array<string>;
  tags: Array<Tag>;
  createdDate: Date;
  modifiedDate: Date;

  constructor() {
    this.regulations = new Array();
    this.tags = new Array();
  }
}
