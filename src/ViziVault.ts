import {Tag} from "./Tag";
import {Attribute} from "./Attribute";
import {Entity} from "./Entity";
import {Regulation} from "./Regulation";
import {SearchRequest} from "./SearchRequest";
import {User} from "./User";
import {AttributeDefinition} from "./AttributeDefinition";
import {VaultException} from "./VaultException";
import {StorageRequest} from "./StorageRequest";
import {ValueException} from "./ValueException";



const fetch = require("node-fetch");


export class ViziVault {
  private baseUrl?: URL;
  private headersDict: Map<string, string>;
  static get contentType() { return 'application/json; charset=utf-8'; }

  public constructor() {
    this.headersDict = new Map();
  }

  public setEncryptionKey(encryptionKey: string) {
    this.headersDict.set("X-Encryption-Key", encryptionKey);
    return true;
  }

  public setDecryptionKey(decryptionKey: string) {
    this.headersDict.set("X-Encryption-Key", decryptionKey);
    return true;
  }

  public setApiKey(authorization: string) {
    this.headersDict.set("Authorization", authorization);
    return true;
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

  public setHeaders(): Headers {
    const requestHeaders = new fetch.Headers();
    this.headersDict.forEach((value, key) => {
      requestHeaders.set(key, value);
    });
    return requestHeaders;
  }

  private setAuth(headers: Headers) {
    if (this.headersDict.has("Authorization"))  {
      headers.set("Authorization", <string> this.headersDict.get("Authorization") )
      return headers
    }
    else {
      throw "Authorization not supplied. Please set authorization before calling vault data access with setApiKey or withApiKey"
    }

  }

  private async post(url: string, body: any, headers?: Headers): Promise<string> {
    try {
      let requestHeaders = new fetch.Headers();
      if (!(headers == null )) {
        requestHeaders = headers
      }

      //this.setAuth(requestHeaders)
      requestHeaders.set("Content-Type", ViziVault.contentType)



      const fullUrl = new URL(this.baseUrl + url);

      const response = await fetch(fullUrl.toString(), {
        method: 'POST',
        body: JSON.stringify(body),
        headers: requestHeaders
      });

      if (!response.ok) {
        throw new VaultException(response.statusText, response.status);
      }
      return response.json();
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private async get(url: string, headers: Headers): Promise<Response> {
    try {
      let requestHeaders = new fetch.Headers()

      if (!(headers === null)) {
        requestHeaders = this.setHeaders();
      }
      const fullUrl = new URL(this.baseUrl + url);

      this.setAuth(requestHeaders)

      const response = await fetch(fullUrl.toString(), {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new VaultException(response.statusText, response.status);
      }
      return response;
    } catch (e) {
      console.log(e);
      return new Response()
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
    } catch (e) {
      console.log(e);
      return "";
    }
  }

  private async getWithDecryptionKey(url: string): Promise<any> {
    if (this.headersDict.has("X-Decryption-Key"))  {
       return await this.get(url, new fetch.Headers({"X-Decryption-Key": this.headersDict.get("X-Decryption-Key") })); }
    else {
       throw "X-Decryption-Key is undefined. Please defined the Decryption key before retrieving data values. Please use setDecryptionKey or withDecryptionKey to initialize the decryption key in your environment."
    }
  }

  private async postWithEncryptionKey(url: string, body: any): Promise<string> {
    if (this.headersDict.has("X-Encryption-Key"))  {
      return await this.post(url, body, new fetch.Headers({"X-Encryption-Key": this.headersDict.get("X-Encryption-Key")  } ) ); }
    else {
      throw "X-Encryption-Key is undefined. Please define the Encryption key before retrieving data values. Please use setEncryptionKey or withEncryptionKey to initialize the encryption key in your environment."
    }
  }

  public async findByEntity(entityId: string): Promise<Entity> {
    const data = await this.getWithDecryptionKey("entities/" + entityId + "/attributes");
    return new Entity(data.data, entityId);
  }

  public async findByUser(entityId: string): Promise<User> {
    const data = await this.getWithDecryptionKey("users/" + entityId + "/attributes");
    let json_data = await data.json()

    json_data.forEach((element) => {


    })

    let myResult = new User(json_data.data, entityId);
    return myResult;
  }

  public async save(entity: Entity): Promise<void> {
    entity.getDeletedAttributes().forEach(async (attribute) => {
      await this.delete("user/" + entity.getId() + "/attribute/" + attribute);
    });

    let pointsList = new Array();
    entity.getChangedAttributes().forEach((attribute) => {
      pointsList.push(attribute);
    });
    entity.clearDeletedAttributes();

    await this.postWithEncryptionKey("users/" + entity.getId() + "/attributes", new StorageRequest(pointsList));
    entity.clearChangedAttributes();
  }

  public async purge(userid: String) {
    await this.delete("users/" + userid + "/data");
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
    return JSON.parse(data);
  }

  public async getAttributeDefinitions(): Promise<Array<AttributeDefinition>> {
    const data = await this.getWithDecryptionKey("attributes/");
    return JSON.parse(data);
  }

  public async storeTag(tag: Tag): Promise<void> {
    await this.post("tags", tag);
  }

  public async getTag(tag: string): Promise<Tag> {
    const data = await this.getWithDecryptionKey("tags/" + tag);
    return JSON.parse(data);
  }

  public async getTags(): Promise<Array<Tag>> {
    const data = await this.getWithDecryptionKey("attributes/");
    return JSON.parse(data);
  }

  public async deleteTag(tag: string): Promise<boolean> {
    try {
      await this.delete("tags/" + tag);
      return true;
    } catch (e) {
      return false;
    }
  }

  public async storeRegulation(regulation: Regulation): Promise<void> {
    await this.post("regulations", regulation);
  }


  public async getRegulations(): Promise<Array<Regulation>> {
    const data = await this.getWithDecryptionKey("regulations/");
    return JSON.parse(data);
  }

  public async getRegulation(key: string): Promise<Regulation> {
    const data = await this.getWithDecryptionKey("regulations/" + key);
    return JSON.parse(data);
  }

  public async search(searchRequest: SearchRequest, page: number, count: number): Promise<Array<Attribute>> {
    if (!(Number.isInteger(page)) || !(Number.isInteger(count)) ) {
      throw new ValueException("Page and Count must be Integers")
    }

    if (page < 0 ) {
      throw new ValueException("Page must not be negative")
    }

    if (count < 0 ) {
      throw new ValueException("Count must not be negative")
    }

    let paginatedSearchRequest = {
      query: searchRequest,
      page: page,
      count: count
    }
    const data = await this.post("data/search", paginatedSearchRequest);
    return JSON.parse(data);
  }

  public async getDataPoint(dataPointId: string): Promise<Attribute> {
    const data = await this.getWithDecryptionKey("data/" + dataPointId);
    return JSON.parse(data);
  }



}
