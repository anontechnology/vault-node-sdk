package io.anontech.vizivault;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ViziVault {

  private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
  
  private URL baseUrl;
  private String apiKey;
  private String encryptionKey;
  private String decryptionKey;

  private OkHttpClient httpClient;
  private Gson gson;

  public ViziVault() {
    httpClient = new OkHttpClient();
    gson = new Gson();
  }

  public ViziVault withBaseURL(URL url) {
    this.baseUrl = url;
    return this;
  }

  public ViziVault withApiKey(String apiKey) {
    this.apiKey = String.format("Bearer %s", apiKey);
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

  private JsonObject post(String url, Object body, Headers headers) {
    try {
      Response response = httpClient.newCall(
          new Request.Builder()
            .url(new URL(baseUrl, url))
            .headers(new Headers.Builder().addAll(headers).add("Authorization", apiKey).build())
            .post(RequestBody.create(gson.toJson(body), JSON))
            .build()
          ).execute();

      JsonObject responseData = gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();
      
      if(! response.isSuccessful()){
        throw new VaultException(responseData.get("message").getAsString(), response.code());
      }

      return responseData;
    } catch(IOException e) {
      // figure out later
      throw new RuntimeException(e);
    }
  }

  private JsonObject get(String url, Headers headers) {
    try {
      Response response = httpClient.newCall(
          new Request.Builder()
            .url(new URL(baseUrl, url))
            .headers(new Headers.Builder().addAll(headers).add("Authorization", apiKey).build())
            .get()
            .build()
          ).execute();

      JsonObject responseData = gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();

      if(! response.isSuccessful()){
        throw new VaultException(responseData.get("message").getAsString(), response.code());
      }

      return responseData;
    } catch(IOException e) {
      // figure out later
      throw new RuntimeException(e);
    }
  }
  
  private JsonObject delete(String url) {
    try {
      Response response = httpClient.newCall(
          new Request.Builder()
            .url(new URL(baseUrl, url))
            .headers(new Headers.Builder().add("Authorization", apiKey).build())
            .delete()
            .build()
          ).execute();

          JsonObject responseData = gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();
      
          if(! response.isSuccessful()){
            throw new VaultException(responseData.get("message").getAsString(), response.code());
          }
    
          return responseData;
    } catch(IOException e) {
      // figure out later
      throw new RuntimeException(e);
    }
  }

  private JsonObject post(String url, Object body) {
    return post(url, body, new Headers.Builder().build());
  }

  private JsonObject getWithDecryptionKey(String url) {
    return get(url, new Headers.Builder().add("X-Decryption-Key", decryptionKey).build());
  }

  private JsonObject postWithEncryptionKey(String url, Object body) {
    return post(url, body, new Headers.Builder().add("X-Encryption-Key", encryptionKey).build());
  }

  public Entity findByEntity(String entityId) {
    List<Attribute> data = gson.fromJson(getWithDecryptionKey(String.format("/entities/%s/attributes", entityId)).get("data"), new TypeToken<List<Attribute>>(){}.getType());
    return new Entity(data, entityId);
  }

  public User findByUser(String entityId) {
    List<Attribute> data = gson.fromJson(getWithDecryptionKey(String.format("/users/%s/attributes", entityId)).get("data"), new TypeToken<List<Attribute>>(){}.getType());
    return new User(data, entityId);
  }

  public void save(Entity entity) {
    
    for(String attribute : entity.getDeletedAttributes()) {
      delete(String.format("/user/%s/attribute/%s", entity.getId(), attribute));
    }

    JsonObject storageRequest = new JsonObject();
    JsonArray pointsList = new JsonArray();
    for(Attribute attribute : entity.getChangedAttributes()) {
      pointsList.add(gson.toJsonTree(attribute));
    }
    storageRequest.add("dataPoints", pointsList);

    postWithEncryptionKey(String.format("/user/%s/attributes", entity.getId()), storageRequest);

  }

  public void purge(Entity entity) {
    delete(String.format("/users/%s/data", entity.getId()));
    entity.purge(); // need to figure out visibility here...
  }

  public void remove(Entity entity, String attributeKey) {
    delete(String.format("/users/%s/attributes/%s", entity.getId(), attributeKey));
    entity.clearAttribute(attributeKey);
  }

  public void storeAttributeDefinition(AttributeDefinition attribute) {
    post("/attributes", attribute);
  }

  public AttributeDefinition getAttribute(String attributeKey) {
    return gson.fromJson(getWithDecryptionKey(String.format("/attributes/%s", attributeKey)), AttributeDefinition.class);
  }

  public AttributeDefinition getAttributes() {
    return gson.fromJson(getWithDecryptionKey(String.format("/attributes/")), new TypeToken<List<AttributeDefinition>>(){}.getType());
  }

  public void storeTag(Tag tag) {
    // ...
  }

  public void storeRegulation(Regulation regulation) {
    post("/regulations", regulation);
  }

  public List<Attribute> search(SearchRequest searchRequest){
    return gson.fromJson(post("/data/search", searchRequest).get("data"), new TypeToken<List<Attribute>>(){}.getType());
  }

  public Attribute getDataPoint(String dataPointId) {
    return gson.fromJson(getWithDecryptionKey(String.format("/data/%s", dataPointId)), Attribute.class);
    // TODO error handling
  }
}