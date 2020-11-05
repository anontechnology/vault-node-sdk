import Axios from 'axios';
import { Tag } from "./Tag";
import { Attribute } from "./Attribute";
import { Entity } from "./Entity";
import { Regulation } from "./Regulation";
import { SearchRequest } from "./SearchRequest";
import { User } from "./User";
import { AttributeDefinition } from "./AttributeDefinition";
import { StorageRequest } from "./StorageRequest";

// TODO Readd in throwing VaultException when requests fail

export class ViziVault {
  private baseUrl?: URL;
  private headersDict: Map<string, string>;
  private encryptionKey: string;
  private decryptionKey: string;

  public constructor() {
    this.headersDict = new Map();
    this.encryptionKey = "";
    this.decryptionKey = "";
  }

  public withBaseURL(url: URL): ViziVault {
    this.baseUrl = url;
    return this;
  }

  public withApiKey(apiKey: string): ViziVault {
    this.headersDict.set("Authorization", "Bearer " + apiKey);
    return this;
  }

  public withEncryptionKey(encryptionKey: string): ViziVault {
    this.headersDict.set("X-Encryption-Key", encryptionKey);
    return this;
  }

  public withDecryptionKey(decryptionKey: string): ViziVault {
    this.headersDict.set("X-Decryption-Key", decryptionKey);
    return this;
  }

  public setHeaders(): Map<string, string> {
    const requestHeaders = new Map<string, string>();
    this.headersDict.forEach((value, key) => {
      requestHeaders.set(key, value);
    });
    return requestHeaders;
  }

  private async post(url: string, body: any, headers?: Map<string, string>): Promise<any> {
    try {
      if (headers === null) {
        headers = this.setHeaders();
      }
      const fullUrl = new URL(this.baseUrl + url);

      const response = await Axios.post(fullUrl.toString(), body, { headers });

      return response;
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private async get(url: string, headers: Map<string, string>): Promise<any> {
    try {
      if (headers === null) {
        headers = this.setHeaders();
      }
      const fullUrl = new URL(this.baseUrl + url);

      const { data } = await Axios.get(fullUrl.toString(), { headers });

      return data;
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private async delete(url: string): Promise<any> {
    try {
      const fullUrl = new URL(this.baseUrl + url);

      const response = await Axios.get(fullUrl.toString(), { headers: this.headersDict });

      return response;
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private getWithDecryptionKey(url: string): Promise<any> {
    return this.get(url, new Map([
      ["X-Decryption-Key", this.decryptionKey]
    ]));
  }

  private postWithEncryptionKey(url: string, body: any): Promise<any> {
    return this.get(url, new Map([
      ["X-Encryption-Key", this.encryptionKey]
    ]));
  }

  public async findByEntity(entityId: string): Promise<Entity> {
    const data = await this.getWithDecryptionKey("/entities/" + entityId + "/attributes");
    return new Entity(data, entityId);
  }

  public async findByUser(entityId: string): Promise<User> {
    const data = await this.getWithDecryptionKey("/users/" + entityId + "/attributes");
    return new User(data, entityId);
  }

  public async save(entity: Entity): Promise<void> {
    entity.getDeletedAttributes().forEach(async (attribute) => {
      await this.delete("/user/" + entity.getId() + "/attribute/" + attribute);
    });

    let pointsList = new Array();
    entity.getChangedAttributes().forEach((attribute) => {
      pointsList.push(attribute);
    });

    await this.postWithEncryptionKey("/user/" + entity.getId() + "/attributes", new StorageRequest(pointsList));
  }

  public async purge(entity: Entity) {
    await this.delete("/users/" + entity.getId() + "/data");
    entity.purge();
  }

  public async remove(entity: Entity, attributeKey: string) {
    await this.delete("/users/" + entity.getId() + "/attributes/" + attributeKey);
    entity.clearAttribute(attributeKey);
  }

  public async storeAttributeDefinition(attribute: AttributeDefinition) {
    await this.post("/attributes", attribute);
  }

  public async getAttributeDefinition(attributeKey: string): Promise<AttributeDefinition> {
    const data = await this.getWithDecryptionKey("/attributes/" + attributeKey);
    return data;
  }

  public async getAttributeDefinitions(): Promise<Array<AttributeDefinition>> {
    const data = await this.getWithDecryptionKey("/attributes/");
    return data;
  }

  public async storeTag(tag: Tag): Promise<void> {
    await this.post("/tags", tag);
  }

  public async getTag(tag: string): Promise<Tag> {
    const data = await this.getWithDecryptionKey("/tags/" + tag);
    return data;
  }

  public async getTags(): Promise<Array<Tag>> {
    return this.getWithDecryptionKey("/attributes/");
  }

  public async deleteTag(tag: string): Promise<boolean> {
    try {
      await this.delete("/tags/" + tag);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async storeRegulation(regulation: Regulation): Promise<void> {
    await this.post("/regulations", regulation);
  }


  public async getRegulations(): Promise<Array<Regulation>> {
    const data = await this.getWithDecryptionKey("/regulations/");
    return data;
  }

  public async getRegulation(key: string): Promise<Regulation> {
    const data = await this.getWithDecryptionKey("/regulations/" + key);
    return data;
  }

  public async search(searchRequest: SearchRequest): Promise<Array<Attribute>> {
    const data = await this.post("/data/search", searchRequest);
    return data;
  }

  public async getDataPoint(dataPointId: string): Promise<Attribute> {
    const data = await this.getWithDecryptionKey("/data/" + dataPointId);
    return data;
  }
}
