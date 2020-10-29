import { Tag } from "./Tag";
import { Attribute } from "./Attribute";
import { Entity } from "./Entity";
import { Regulation } from "./Regulation";
import { SearchRequest } from "./SearchRequest";
import { User } from "./User";
import { AttributeDefinition } from "./AttributeDefinition";
import { VaultException } from "./VaultException";
import { StorageRequest } from "./StorageRequest";

export class ViziVault {
  private baseUrl: URL;
  private headersDict: Map<string, string>;
  private encryptionKey: string;
  private decryptionKey: string;

  public constructor() {
    this.baseUrl = null;
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

  public setHeaders() : Headers {
    const requestHeaders = new Headers();
    this.headersDict.forEach((value, key) => {
      requestHeaders.set(key, value);
    });
    return requestHeaders;
  }

  private async post(url: string, body: any, headers?: Headers): Promise<string> {
    try {
      if (headers === null) {
        headers = this.setHeaders();
      }
      const fullUrl = new URL(this.baseUrl + url);

      const response = await fetch(fullUrl.toString(), {
        method: 'POST',
        body: body,
        headers: headers
      });
      
      if (!response.ok) {
        throw new VaultException(response.statusText, response.status);
      }
      return response.json();
    } catch(e) {
      console.log(e);
    }
  }

    private async get(url: string, headers: Headers): Promise<string> {
      try {
        if (headers === null) {
          headers = this.setHeaders();
        }
        const fullUrl = new URL(this.baseUrl + url);
  
        const response = await fetch(fullUrl.toString(), {
          method: 'GET',
          headers: headers
        });
        
        if (!response.ok) {
          throw new VaultException(response.statusText, response.status);
        }
        return response.json();
      } catch(e) {
        console.log(e);
      }
    }

    private async delete(url: string): Promise<string> {
        try {
          const fullUrl = new URL(this.baseUrl + url);
    
          const response = await fetch(fullUrl.toString(), {
            method: 'DELETE',
            headers: this.setHeaders()
          });
          
          if (!response.ok) {
            throw new VaultException(response.statusText, response.status);
          }
          return response.json();
        } catch(e) {
          console.log(e);
        }
    }

    private async getWithDecryptionKey(url: string): Promise<string> {
      return await this.get(url, new Headers({"X-Decryption-Key" : this.decryptionKey}));
    }

    private async postWithEncryptionKey(url: string, body: any): Promise<string> {
      return await this.post(url, body, new Headers({"X-Encryption-Key": this.encryptionKey}));
    }

    public async findByEntity(entityId: string): Promise<Entity> {
      const data = await this.getWithDecryptionKey("/entities/" + entityId + "/attributes");
      return new Entity(JSON.parse(data), entityId);
    }

    public async findByUser(entityId: string): Promise<User> {
      const data = await this.getWithDecryptionKey("/users/" + entityId + "/attributes");
      return new User(JSON.parse(data), entityId);
    }

    public async save(entity: Entity): Promise<void> {
      entity.getDeletedAttributes().forEach(async (attribute) => {
        await this.delete("/user/" + entity.id + "/attribute/" + attribute);
      });

      let pointsList = new Array();
      entity.getChangedAttributes().forEach((attribute) => {
        pointsList.push(attribute);
      });

      await this.postWithEncryptionKey("/user/" + entity.id + "/attributes", new StorageRequest(pointsList));  
    }

    public async purge(entity: Entity) {
      await this.delete("/users/" + entity.id + "/data");
      entity.purge();
    }

    public async remove(entity: Entity, attributeKey: string) {
      await this.delete("/users/" + entity.id + "/attributes/" + attributeKey);
      entity.clearAttribute(attributeKey);
    }

    public async storeAttributeDefinition(attribute: AttributeDefinition) {
      await this.post("/attributes", attribute);
    }

    public async getAttributeDefinition(attributeKey: string): Promise<AttributeDefinition> {
      const data = await this.getWithDecryptionKey("/attributes/" + attributeKey);
      return JSON.parse(data);
    }

    public async getAttributeDefinitions(): Promise<Array<AttributeDefinition>> {
      const data = await this.getWithDecryptionKey("/attributes/");
      return JSON.parse(data);
    }

    public async storeTag(tag: Tag): Promise<void> {
      await this.post("/tags", tag);
    }

    public async getTag(tag: string): Promise<Tag> {
      const data = await this.getWithDecryptionKey("/tags/" + tag);
      return JSON.parse(data);
    }

    public async getTags(): Promise<Array<Tag>> {
      const data = await this.getWithDecryptionKey("/attributes/");
      return JSON.parse(data);
    }

    public async deleteTag(tag: string): Promise<boolean> {
      try {
        await this.delete("/tags/" + tag);
        return true;
      } catch(e) {
        return false;
      }
    }

    public async storeRegulation(regulation: Regulation): Promise<void> {
      await this.post("/regulations", regulation);
    }

    
  public async getAllRegulations(): Promise<Array<Regulation>> {
    const data = await this.getWithDecryptionKey("/regulations/");
    return JSON.parse(data);
  }

  public async getRegulations(key: string): Promise<Regulation> {
    const data = await this.getWithDecryptionKey("/regulations/" + key);
    return JSON.parse(data);
  }

    public async search(searchRequest: SearchRequest): Promise<Array<Attribute>> {
      const data = await this.post("/data/search", searchRequest);
      return JSON.parse(data);
    }

    public async getDataPoint(dataPointId: string): Promise<Attribute> {
      const data = await this.getWithDecryptionKey("/data/" + dataPointId);
      return JSON.parse(data);
    }
}
