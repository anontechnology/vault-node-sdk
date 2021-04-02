## Anontech Java ViziVault Bindings

### Project Description
AnonTech's ViziVault system is designed to make the retrieval and storage of personal and sensitive information easy. Our multi-layer encryption/decryption system will make your data secure and accessible only to memebrs of your organization on a "need-to-use" basis. Data providers, individuals, end users, and even developers can rest safe knowing that their personal data is stored securely, access is monitored, and their most personal data is kept securely, seperate from day-to-day business operations. Personal data is there when you need it most to support business operations, and disappears back into the vault when it's not needed, so that your system can be safe and secure.


### Support
Please report bugs and issues to support@anontech.io

### Requirements

### Installaion

`npm install anontech-vizivault-client`

### Authentication
You must provide an application identifier or api key for all operations, to identify you and your application to the vault for authenticaion. For data insertion, a valid encryption key is necessary. For data retrieval, a valid decryption key is necessary.

We recommend at a minimum putting your encryption and decryption key locally in a secure location, such as a local file on disk.

### Quick start

#### Attaching to your Vault

```js
const encryptionKey = process.env.VIZIVAULT_ENCRYPTION_KEY;
const decryptionKey = process.env.VIZIVAULT_DECRYPTION_KEY;
let vault = new ViziVault()
  .withBaseURL(url)
  .withAPIKey(apiKey)
  .withEncryptionKey(encryptionKey)
  .withDecryptionKey(decryptionKey);
```

#### Attributes

[Attributes](https://docs.anontech.io/glossary/datapoint/) are how the ViziVault ecosystem organizes your data. Every attribute consists of three main components: a user id, which represents who the data is about; a value, which is some piece of information about the user; and an attribute name, which expresses the relationship between the user and the value. For example, in an online retail application, there would be an attribute for shipping addresses, an attribute for billing addresses, and an attribute for credit card information.

#### Adding an Attribute to an Entity or User

```js
// Adding an attribute to user
vault.findByUser("User1234").then((user) => {
    user.setAttribute("FIRST_NAME", "Jane");
    vault.save(user);
});

// Adding an attribute to entity
vault.findByEntity("Client6789").then((entity) => {
    entity.setAttribute("FULL_ADDRESS", "1 Hacker Way, Beverly Hills, CA 90210");
    vault.save(entity);
});
```

### Retrieving all Attributes of an Entity or User
Retrieves all [Attributes](https://docs.anontech.io/glossary/datapoint/) for the specified entity or user. Returns a list of attribute objects.

```js
// Retrieving all attributes for a user
vault.findByUser("User1234").then((user) => {
    let attributes = user.getAttributes();
});

// Retrieving all attributes for an entity
vault.findByEntity("Client6789").then((entity) => {
    let attributes = entity.getAttributes();
});
```

### Searching

To search a vault for [Attributes](https://docs.anontech.io/glossary/datapoint/) , pass in a SearchRequest. A list of matching Attributes will be returned. For more information, read about [ViziVault Search](https://docs.anontech.io/tutorials/search/).

```js
const count = 1;
const page = 1;
vault.search(new SearchRequest("LAST_NAME", "Doe"), page, count).then((attributes) => {
    // use attributes
});
```

### Deleting User Attributes
```js
// Purging all user attributes
vault.findByUser("User1234").then((user) => {
    user.purge();
});

// Removing specific attribute
let user = vault.findByUser("User1234").then((user) => {
    user.remove("LAST_NAME");
});
```

### Attribute Definitions

[Attribute definitions](https://docs.anontech.io/glossary/attribute/) define an object that contains all relevant metadata for attributes with a given `key`. This is how tags and regulations become associated with attributes. Attributes can contain a schema to further break down the structure of their value. Display names and hints can also be added to the Attribute Definition for ease of use and readability.

#### Storing an Attribute Definition in the Vault

To store an Attribute Definition, create an AttributeDefinition object and save it to the Vault. The following code details the various properties of the AttributeDefinition object.

```js
let attribute = new AttributeDefinition();
attribute.setName("Billing Address");
attribute.setTags(["geographic_location", "financial"]);
attribute.setHint("{ line_one: \"1 Hacker Way\", line_two: \"Apt. 53\", city: \"Menlo Park\", state: \"California\", postal_code: \"94025-1456\" country: \"USA\" }");
attribute.setSchema(JSON.stringify({ 
                    "line_one": "string",
                    "line_two": "string",
                    "city": "string",
                    "state": "string",
                    "postal_code": "string",
                    "country": "string"
                  }));
attribute.setRepeatable(false);
attribute.setImmutable(false);
attribute.setIndexed(false);
attribute.setRegulations(["GDPR", "CCPA"]);

vault.storeAttribute(attribute);
```

### Tags

Similar to [Regulations](https://docs.anontech.io/glossary/regulation/) , [Tags](https://docs.anontech.io/api/tags/) are user-defined strings that can be applied to Attributes to aid in classification and searching.


#### Storing a Tag in the vault

To store a new [Tag](https://docs.anontech.io/api/tags/) , create a Tag object and save it to the Vault.

```js
vault.save(new Tag("Financial Data"));
```

#### Retrieving Tags from the Vault

[Tags](https://docs.anontech.io/api/tags/) can be retrieved as a list of Tag objects or as a single Tag if the specific Tag is specified.

```js
// Retrieving all tags
vault.getTags().then((tags) => {
    // use tags
});

// Retrieving specific tag
vault.getTag("Financial Data").then((tag) => {
    // use tag
});
```

#### Deleting Tags from the Vault

To remove a [Tag](https://docs.anontech.io/api/tags/) , specify the Tag to be removed. A boolean denoting the status of the operation will be returned.

```js
// Removing a specific tag
vault.removeTag("Financial Data").then((removed) => {
    // removed is a boolean
});
```

### Regulations

A regulation object represents a governmental regulation that impacts how you can use the data in your vault. Each data point can have a number of regulations associated with it, which makes it easier to ensure your use of the data is compliant. You can tag data points with regulations when entering them into the system, or specify rules that the system will use to automatically tag regulations for you.

#### Storing a Regulation in the Vault

To store a [Regulation](https://docs.anontech.io/glossary/regulation/) to the Vault, create a new Regulation object and save it to the Vault. The constructor takes the key, name, and url of the Regulation.


```js
// Storing a regulation
let regulation = new Regulation();
regulation.setKey("GDPR");
regulation.setName("General Data Protection Regulation");
regulation.setUrl("https://gdpr.eu/");
regulation.setRule(new UserRule("GEOGRAPHIC_REGION", UserRule.UserValuePredicate.EQUALS, "EU"));
vault.save(regulation);
```

#### Retrieving Regulations from the Vault

[Regulations](https://docs.anontech.io/glossary/regulation/) can be retrieved as a list of Regulation objects or as a single Regulation if the specific Regulation is specified.

```js
// Retrieving all regulations
vault.getRegulations().then((regulations) {
    // use regulations
});

// Retrieving specific regulation
vault.getRegulation("GDPR").then((regulation) => {
    // use regulation
});
```

#### Deleting Regulations from the Vault

To remove a [Regulation](https://docs.anontech.io/glossary/regulation/) , specify the Regulation to be removed. A boolean denoting the status of the operation will be returned.

```js
// Removing a specific regulation
vault.removeRegulation("GDPR").then((removed) => {
    // removed is a boolean
});
```

