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
import { PaginatedSearchRequest } from './PaginatedSearchRequest';
import {ValueException} from "./ValueException";

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

  public setEncryptionKey(encryptionKey: string) {
    this.encryptionKey = encryptionKey;
    return true;
  }

  public setDecryptionKey(decryptionKey: string) {
    this.decryptionKey = decryptionKey;
    return true;
  }

  public setApiKey(authorization: string) {
    this.apiKey = authorization;
    return true;
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
      let data = null
      if (decrypt) {
          data = await Axios.get(fullUrl.toString(), {
          headers: {
            'X-Decryption-Key': this.decryptionKey
          }
        });

        return data.data;
      } else {
        const { data } = await Axios.get(fullUrl.toString());
        return data;
      }
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
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
        return Promise.reject(new VaultException(message, status) );
      }
    );
    try {
      const fullUrl = new URL(this.baseUrl + url);

      const response = await Axios.delete(fullUrl.toString(), {
        headers: {
          'Authorization': this.apiKey
        }
      });

      return response;
    } catch (e) {
      console.log(e);
      return Promise.reject(e);
    }
  }

  private getWithDecryptionKey(url: string): Promise<any> {
    return this.get(url, true);
  }

  private postWithEncryptionKey(url: string, body: any): Promise<any> {
    return this.post(url, body, true);
  }

  public async findByEntity(entityId: string): Promise<any> {
    await this.getWithDecryptionKey("entities/" + entityId + "/attributes").then((data) => {
      this.get("entities/" + entityId).then((entity) => {
        data.array.forEach((attribute: Attribute) => {
          console.log(attribute);
          entity.addAttributeWithoutPendingChange(attribute);
        });

        return entity;
      });
    });
  }

  public async findByUser(entityId: string): Promise<any> {
    let data = await this.getWithDecryptionKey("users/" + entityId + "/attributes")


    let user = await this.get("users/" + entityId);

    let new_user = Object.assign(new User(entityId), user.data)

    data.data.forEach((attribute: Attribute) => {
      let new_attribute = Object.assign(new Attribute(), attribute)
      new_user.addAttributeWithoutPendingChange(Object.assign(new Attribute(), new_attribute));
    });

    return new_user;
  }

  public async save(entity: Entity): Promise<void> {
    for (const attribute of entity.getDeletedAttributes()) {
      let attributeString =  JSON.stringify(attribute).replace(/['"]+/g, '');
      await this.delete(`users/${entity.getId()}/attributes/` + attributeString);
    }
    entity.setDeletedAttributes([]);

    await this.post(entity instanceof User ? "users" : "/entities", new EntityDefinition(entity));

    if (entity.getChangedAttributes().length > 0) {
      await this.postWithEncryptionKey(`users/${entity.getId()}/attributes`, new StorageRequest(entity.getChangedAttributes()));
    }

    entity.setChangedAttributes([]);
  }

  public async purge(userId: String) {
    await this.delete("users/" + userId + "/data");
  }

  public async remove(entity: Entity, attributeKey: string) {
    await this.delete("users/" + entity.getId() + "/attributes/" + attributeKey);
    entity.clearAttribute(attributeKey);
  }

  public async storeAttributeDefinition(attribute: AttributeDefinition) {
    await this.post("attributes", attribute);
  }

  public async getAttributeDefinition(attributeKey: string): Promise<AttributeDefinition> {
    const data = await this.getWithDecryptionKey("attributes/" + attributeKey);

    return data;
  }

  public async getAttributeDefinitions(): Promise<Array<AttributeDefinition>> {
    const data = await this.getWithDecryptionKey("attributes/");
    return data;
  }

  public async storeTag(tag: Tag): Promise<void> {
    await this.post("tags", tag);
  }

  public async getTag(tag: String): Promise<Tag> {
    const data = await this.getWithDecryptionKey("tags/" + tag);
    return data;
  }

  public async getTags(): Promise<Array<Tag>> {
    const data = await this.getWithDecryptionKey("tags/");
    let tags: Array<Tag> = [];

    data.data.forEach((tag: Tag) => {
      tags.push(Object.assign(new Tag(''), tag));
    });

    return tags;
  }

  public async deleteTag(tag: String): Promise<boolean> {
    try {
      let my_delete = await this.delete("tags/" + tag);
      return true;
    } catch (VaultResponseException) {
      return false;
    }
  }

  public async storeRegulation(regulation: Regulation): Promise<void> {
    await this.post("regulations", regulation);
  }


  public async getRegulations(): Promise<Array<Regulation>> {
    const data = await this.getWithDecryptionKey("regulations/");
    return data;
  }

  public async getRegulation(key: string): Promise<Regulation> {
    const data = await this.getWithDecryptionKey("regulations/" + key);
    return data;
  }

  public async search(searchRequest: SearchRequest, page: number, count: number): Promise<Array<Attribute>> {
    if (!(Number.isInteger(page)) || !(Number.isInteger(count)) ) {
      throw new ValueException("Page and Count must be Integers")
    } else if (page < 0 ) {
      throw new ValueException("Page must not be negative")
    } else if (count < 0 ) {
      throw new ValueException("Count must not be negative")
    }

    const data = await this.post("search", new PaginatedSearchRequest(searchRequest, page, count));

    let searchResults = new Array<Attribute>();
    data.data.data.forEach((result: Object) => {
      let new_attribute = Object.assign(new Attribute(), result)
      searchResults.push(new_attribute)
    });

    return searchResults;
  }

  public async getDataPoint(dataPointId: string): Promise<Attribute> {
    const data = await this.getWithDecryptionKey("data/" + dataPointId);
    let new_attribute = Object.assign(new Attribute(), data.data)
    return new_attribute;
  }
}
