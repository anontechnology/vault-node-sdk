export class ValueException extends Error {

  public message: string;

  public constructor(message: string) {
    super();
    this.message = message;
  }

}
