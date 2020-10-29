export class PrimitiveSchema {
  string: string;
  
  constructor() {
  }
}

export namespace PrimitiveSchema {
  export enum PrimitiveSchema {
    String, Integer, Boolean, Float, File, Date
  }
}
