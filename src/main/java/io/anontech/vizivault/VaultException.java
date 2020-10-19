package io.anontech.vizivault;

public class VaultException extends RuntimeException {

  private static final long serialVersionUID = 1L;

  private final String message;
  private final int statusCode;

  public VaultException(String message, int status) {
    this.message = message;
    this.statusCode = status;
  }

  @Override
  public String getMessage() {
    return message;
  }

  public int getStatus() {
    return statusCode;
  }

}
