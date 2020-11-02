
export class SearchRequest {
  private regulations: Array<string>;
  private values: Array<ValueSearchRequest>;
  private attributes: Array<string>;
  private sensitivity: string;
  private userId: string;
  private country: string;
  private subdivision: string;
  private city: string;
  private minCreatedDate?: Date;
  private maxCreatedDate?: Date;
  private minModifiedDate?: Date;
  private maxModifiedDate?: Date;

  public constructor(attribute?: any, value?: any) {
    this.regulations = new Array();
    this.values = new Array();
    this.attributes = new Array();
    this.sensitivity = "";
    this.userId = "";
    this.country = "";
    this.subdivision = "";
    this.city = "";

    this.addValueQuery(attribute, value);
  }

  public addValueQuery(attribute: string, value: string) {
    this.values.push(new ValueSearchRequest(attribute, value));
  }
}

export class ValueSearchRequest {
  attribute: string;
  value: string;

  public constructor(attribute?: any, value?: any) {
    this.attribute = attribute;
    this.value = value;
  }
}
