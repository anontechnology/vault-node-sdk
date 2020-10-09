package io.anontech.vizivault;

public class ViziVault {

  private String baseUrl;
  private String clientId;
  private String apiKey;
  private String encryptionKey;
  private String decryptionKey;

  public ViziVault withBaseURL(String url) {
    this.baseUrl = url;
    return this;
  }

  public ViziVault withClientId(String clientId) {
    this.clientId = clientId;
    return this;
  }

  public ViziVault withApiKey(String apiKey) {
    this.apiKey = apiKey;
    return this;
  }

  public ViziVault withEncryptionKey(String encryptionKey) {
    this.encryptionKey = encryptionKey;
    return this;
  }

  public ViziVault withDecryptionKey(String decryptionKey) {
    this.decryptionKey = decryptionKey;
    return this;
  }

  public Entity findByEntity(String entityId) {
    //...
  }

  public void save(Entity entity) {
    //...
  }

  public void purge(Entity entity) {
    // ...
  }

  public void remove(Entity entity, String attributeKey) {
    // ...
  }

  public void storeAttribute(Attribute attribute) {
    // ...
  }

  public void storeTag(Tag tag) {
    // ...
  }

  public void storeRegulation(Regulation regulation) {
    // ...
  }

}