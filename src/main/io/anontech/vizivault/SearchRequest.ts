
export class SearchRequest {
  regulations: Array<string>;
  values: Array<ValueSearchRequest>;
  attributes: Array<string>;
  sensitivity: string;
  userId: string;
  country: string;
  subdivision: string;
  city: string;
  minCreatedDate: Date;
  maxCreatedDate: Date;
  minModifiedDate: Date;
  maxModifiedDate: Date;

  public constructor(attribute?: any, value?: any) {
    this.regulations = new Array();
    this.values = new Array();
    this.attributes = new Array();

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
