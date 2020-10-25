export class VaultException extends Error {
  static serialVersionUID: number = 1;
  message: string;
  statusCode: number;

  public constructor(message: string, status: number) {
    super();
    if (this.message === undefined) { this.message = null; }
    if (this.statusCode === undefined) { this.statusCode = 0; }
    this.message = message;
    this.statusCode = status;
  }

  public getMessage(): string {
    return this.message;
  }

  public getStatus(): number {
    return this.statusCode;
  }
}
