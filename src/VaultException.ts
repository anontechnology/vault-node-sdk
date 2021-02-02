export class VaultException extends Error {
  private statusCode: number;
  public message: string;

  public constructor(message: string, status: number) {
    super();
    this.message = message;
    this.statusCode = status;
  }

  public getStatusCode(): number {
    return this.statusCode;
  }

  public setStatusCode(statusCode: number): void {
    this.statusCode = statusCode;
  }
}
