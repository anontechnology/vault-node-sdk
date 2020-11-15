
export class SearchRequest {
  private regulations: Array<string>;
  private values: Array<ValueSearchRequest>;
  private attributes?: Array<string>;
  private sensitivity?: string;
  private userId?: string;
  private country?: string;
  private subdivision?: string;
  private city?: string;
  private minCreatedDate?: Date;
  private maxCreatedDate?: Date;
  private minModifiedDate?: Date;
  private maxModifiedDate?: Date;

  public constructor(attribute?: any, value?: any) {
    this.regulations = new Array();
    this.values = new Array();
    this.attributes = new Array();

    this.addValueQuery(attribute, value);
  }

  public addValueQuery(attribute: string, value: string) {
    this.values.push(new ValueSearchRequest(attribute, value));
  }

  getAttributes(): Array<string> | undefined {
    return this.attributes;
  }

  setAttributes(attributes: Array<string>): void {
    this.attributes = attributes;
  }

  getRegulations(): Array<string> | undefined {
    return this.regulations;
  }

  setRegulations(regulations: Array<string>): void {
    this.regulations = regulations;
  }

  getSensitivity(): string | undefined {
    return this.sensitivity;
  }

  setSensitivity(sensitivity: string): void {
    this.sensitivity = sensitivity;
  }

  getUserId(): string | undefined {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getCountry(): string | undefined {
    return this.country;
  }

  setCountry(country: string): void {
    this.country = country;
  }

  getSubdivision(): string | undefined {
    return this.subdivision;
  }

  setSubdivision(subdivision: string): void {
    this.subdivision = subdivision;
  }

  getCity(): string | undefined {
    return this.city;
  }

  setCity(city: string): void {
    this.city = city;
  }

  getMinCreatedDate(): Date | undefined {
    return this.minCreatedDate;
  }

  setMinCreatedDate(minCreatedDate: Date): void {
    this.minCreatedDate = minCreatedDate;
  }

  getMaxCreatedDate(): Date | undefined {
    return this.maxCreatedDate;
  }

  setMaxCreatedDate(maxCreatedDate: Date): void {
    this.maxCreatedDate = maxCreatedDate;
  }

  getMinModifiedDate(): Date | undefined {
    return this.minModifiedDate;
  }

  setMinModifiedDate(minModifiedDate: Date): void {
    this.minModifiedDate = minModifiedDate;
  }

  getMaxModifiedDate(): Date | undefined {
    return this.maxModifiedDate;
  }

  setMaxModifiedDate(maxModifiedDate: Date): void {
    this.maxModifiedDate = maxModifiedDate;
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
