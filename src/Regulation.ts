import { RegulationRule } from "./tagging/RegulationRule";

export class Regulation {
  key: string;
  name: string;
  url: string;
  rule: RegulationRule;
  createdDate: Date;
  modifiedDate: Date;
}
