import Axios from 'axios';
import { Tag } from "./Tag";
import { Attribute } from "./Attribute";
import { Entity } from "./Entity";
import { Regulation } from "./Regulation";
import { SearchRequest } from "./SearchRequest";
import { User } from "./User";
import { AttributeDefinition } from "./AttributeDefinition";
import { StorageRequest } from "./StorageRequest";
import { VaultException } from './VaultException';
import { EntityDefinition } from './EntityDefinition';

export class ViziVault {
  private baseUrl?: URL;
  private encryptionKey: string;
  private decryptionKey: string;
  private apiKey: string;

  public constructor() {
    this.encryptionKey = "";
    this.decryptionKey = "";
    this.apiKey = "";
  }

  public withBaseURL(url: URL): ViziVault {
    this.baseUrl = url;
    return this;
  }

  public withApiKey(apiKey: string): ViziVault {
    this.apiKey = apiKey;
    return this;
  }

  public withEncryptionKey(encryptionKey: string): ViziVault {
    this.encryptionKey = encryptionKey;
    return this;
  }

  public withDecryptionKey(decryptionKey: string): ViziVault {
    this.decryptionKey = decryptionKey;
    return this;
  }

  private async post(url: string, body: any, encrypt?: boolean): Promise<any> {
    Axios.interceptors.response.use(
      res => {
        return res;
      },
      err => {
        console.log(err);
        let response = err.response;
        let message = "Something went wrong."
        let status = 418;
        if (response) {
          status = response.status;
          if (response.data) {
            message = response.data.message;
          }
        }
        return Promise.reject(new VaultException(message, status));
      }
    );
    try {
      const fullUrl = new URL(this.baseUrl + url);

      if (encrypt) {
        const response = await Axios.post(fullUrl.toString(), body, {
          headers: {
            'X-Encryption-Key': this.encryptionKey
          }
        });
  
        return response;
      } else {
        const response = await Axios.post(fullUrl.toString(), body);
  
        return response;
      }
    } catch (e) {
      console.log(e);
    }
  }

  private async get(url: string, decrypt?: boolean): Promise<any> {
    Axios.interceptors.response.use(
      res => res,
      err => {
        console.log(err);
        let response = err.response;
        let message = "Something went wrong."
        let status = 418;
        if (response) {
          status = response.status;
          if (response.data) {
            message = response.data.message;
          }
        }
        return Promise.reject(new VaultException(message, status));
      }
    );
    try {
      const fullUrl = new URL(this.baseUrl + url);
      if (decrypt) {
        const { data } = await Axios.get(fullUrl.toString(), {
          headers: {
            'X-Decryption-Key': this.decryptionKey
          }
        });
  
        return data;
      } else {
        const { data } = await Axios.get(fullUrl.toString());
        return data;
      }
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private async delete(url: string): Promise<any> {
    Axios.interceptors.response.use(
      res => res,
      err => {
        let response = err.response;
        let message = "Something went wrong."
        let status = 418;
        if (response) {
          status = response.status;
          if (response.data) {
            message = response.data.message;
          }
        }
        return Promise.reject(new VaultException(message, status));
      }
    );
    try {
      const fullUrl = new URL(this.baseUrl + url);

      const response = await Axios.delete(fullUrl.toString());

      return response;
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private getWithDecryptionKey(url: string): Promise<any> {
    return this.get(url, true);
  }

  private postWithEncryptionKey(url: string, body: any): Promise<any> {
    return this.post(url, body, true);
  }

  public async findByEntity(entityId: string): Promise<any> {
    await this.getWithDecryptionKey("/entities/" + entityId + "/attributes").then((data) => {
      this.get("/entities/" + entityId).then((entity) => {
        data.array.forEach((attribute: Attribute) => {
          console.log(attribute);
          entity.addAttributeWithoutPendingChange(attribute);
        });

        return entity;
      });
    }); 
  }

  public async findByUser(entityId: string): Promise<any> {
    await this.getWithDecryptionKey("/users/" + entityId + "/attributes").then((data) => {
      this.get("/users/" + entityId).then((user) => {
        data.array.forEach((attribute: Attribute) => {
          console.log(attribute);
          user.addAttributeWithoutPendingChange(attribute);
        });
        
        return user;
      });
    });    
  }

  public async save(entity: Entity): Promise<void> {
    entity.getDeletedAttributes().forEach(async (attribute) => {
      await this.delete("/users/" + entity.getId() + "/attribute/" + JSON.stringify(attribute));
    });
    entity.setDeletedAttributes([]);

    await this.post(entity instanceof User ? "/users" : "/entities", new EntityDefinition(entity));

    if (entity.getChangedAttributes().length > 0) {
      await this.postWithEncryptionKey(`/users/${entity.getId()}/attributes`, new StorageRequest(entity.getChangedAttributes()));
    }

    entity.setChangedAttributes([]);
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

  public async getTag(tag: Tag): Promise<Tag> {
    const data = await this.getWithDecryptionKey("/tags/" + tag.getName());
    return data;
  }

  public async getTags(): Promise<Array<Tag>> {
    return this.getWithDecryptionKey("/tags/");
  }

  public async deleteTag(tag: Tag): Promise<boolean> {
    try {
      await this.delete("/tags/" + tag.getName());
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
    const data = await this.post("/search", searchRequest);
    return data;
  }

  public async getDataPoint(dataPointId: string): Promise<Attribute> {
    const data = await this.getWithDecryptionKey("/data/" + dataPointId);
    return data;
  }
}
