package io.anontech.vizivault;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import io.anontech.vizivault.dto.DataPointElement;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ViziVault {

  private static final MediaType JSON = MediaType.parse("application/json; charset=utf-8");
  
  private URL baseUrl;
  //private String clientId;
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

  //public ViziVault withClientId(String clientId) {
  //  this.clientId = clientId;
  //  return this;
  //}

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

  private JsonObject post(String url, Object body, Headers headers) throws IOException {
    
    Response response = httpClient.newCall(
        new Request.Builder()
          .url(new URL(baseUrl, url))
          .headers(headers)
          .post(RequestBody.create(gson.toJson(body), JSON))
          .build()
        ).execute();

    return gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();
  }

  private JsonObject get(String url, Headers headers) {
    // TODO api key
    try {
      Response response = httpClient.newCall(
          new Request.Builder()
            .url(new URL(baseUrl, url))
            .headers(headers)
            .get()
            .build()
          ).execute();

      return gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();
    } catch(IOException e) {
      // who cares
      throw new RuntimeException(e);
    }
  }
  
  private JsonObject delete(String url) {
    // TODO api key
    try {
      Response response = httpClient.newCall(
          new Request.Builder()
            .url(new URL(baseUrl, url))
            .delete()
            .build()
          ).execute();

      return gson.fromJson(response.body().string(), JsonElement.class).getAsJsonObject();
    } catch(IOException e) {
      // who cares
      throw new RuntimeException(e);
    }
  }

  private JsonObject getWithEncryptionKey(String url) {
    return get(url, new Headers.Builder().add("X-Decryption-Key", encryptionKey).build());
  }

  public Entity findByEntity(String entityId) {
    List<DataPointElement> data = gson.fromJson(getWithEncryptionKey(String.format("/users/%s/attributes", entityId)).get("data"), new TypeToken<List<DataPointElement>>(){}.getType());
    return new Entity(data, entityId);
  }

  public void save(Entity entity) {
    // POST /user/{id}/attributes
    // just the ones that are marked as having changed, though
  }

  public void purge(Entity entity) {
    delete(String.format("/users/{id}/data", entity.getId()));
    entity.purge(); // need to figure out visibility here...
  }

  public void remove(Entity entity, String attributeKey) {
    delete(String.format("/users/{id}/attributes/{key}", entity.getId(), attributeKey));
    entity.clearAttribute(attributeKey);
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