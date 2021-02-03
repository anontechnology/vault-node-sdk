const assert = require('assert');

import {ViziVault} from "../ViziVault";
import {AttributeDefinition} from "../AttributeDefinition";
import {User} from "../User";
import {Attribute} from "../Attribute";
import {SearchRequest} from "../SearchRequest";


const fs = require('fs')

beforeEach(function (done) {
  let encryptionKey = fs.readFileSync('./src/test/resources/encryptionKey.txt', 'utf8')
  let decryptionKey = fs.readFileSync('./src/test/resources/decryptionKey.txt', 'utf8')

  let vault = new ViziVault().withBaseURL(new URL("http://localhost:8083"))
    .withApiKey("aaa")
    .withEncryptionKey(encryptionKey)
    .withDecryptionKey(decryptionKey);

  this.username = 'exampleUser'

  done();
});

afterEach(function (done) {
  this.vault.purge('exampleUser');
  done();
});


describe('Simple test suite:', function () {
  it('1 === 1 should be true', function () {
    console.log(this.encryptionKey)
    assert(1 === 1);
  });
});

describe('round Trip Data test:', function () {

  // Declare test environment things here.
  let encryptionKey = fs.readFileSync('./src/test/resources/encryptionKey.txt', 'utf8')
  let decryptionKey = fs.readFileSync('./src/test/resources/decryptionKey.txt', 'utf8')

  let vault = new ViziVault().withBaseURL(new URL("http://localhost:8083"))
    .withApiKey("aaa")
    .withEncryptionKey(encryptionKey)
    .withDecryptionKey(decryptionKey);

  it('Load and retrieve data from vault', async function (done) {
    let sentUser = new User([], "exampleUser")
    let attributeDef1 = new AttributeDefinition()
    let attributeDef2 = new AttributeDefinition()

    attributeDef1.setName("TestAttribute")
    attributeDef2.setName("TestAttribute2")
    attributeDef2.setRepeatable(true);

    await vault.storeAttributeDefinition(attributeDef1);
    await vault.storeAttributeDefinition(attributeDef2);

    let attribute1 = new Attribute().withAttribute(attributeDef1.getName()).withValue("exampleUser's first name")

    sentUser.setAttribute(attribute1);
    sentUser.buildAttribute(attributeDef2.getName(), "exampleUser's last name'");
    sentUser.buildAttribute(attributeDef2.getName(), "exampleUser's other last name'");
    await vault.save(sentUser)

    let testUser = await vault.findByUser("exampleUser")
    console.log(testUser)
    assert(attribute1.getValue == testUser.getAttribute(attributeDef1.getName()).getValue());
    assert(testUser.getAttributes().length == 3)
    assert(testUser.getAttribute(attributeDef2.getName()).length == 2);

    // Remove one Attribute
    testUser.clearAttribute(attributeDef1.getName());
    await vault.save(testUser)


    let receivedUserAfterDeletion = await vault.findByUser("exampleUser")
    assert(receivedUserAfterDeletion.getAttribute(attributeDef1.getName()) == null)

    done();
  });

  it( 'testSearch', async function (done) {
    let attributeDef1 = new AttributeDefinition()
    attributeDef1.setIndexed(true);
    let attributeDef2 = new AttributeDefinition()

    attributeDef1.setName("TestAttribute1")
    attributeDef2.setName("TestAttribute2")
    attributeDef2.setRepeatable(true);

    await vault.storeAttributeDefinition(attributeDef1);
    await vault.storeAttributeDefinition(attributeDef2);

    let user1 = new User([],"user1");
    user1.buildAttribute(attributeDef1.getName(), "common first name")
    await vault.save(user1);

    let user2 = new User([],"user2");
    user2.buildAttribute(attributeDef1.getName(), "common first name")
    user2.buildAttribute(attributeDef1.getName(), "user2's last name")
    await vault.save(user2);

    let searchRequest = new SearchRequest();
    searchRequest.addValueQuery(attributeDef1.getName(), "common first name")
    searchRequest.addValueQuery(attributeDef2.getName(), "user2's last name")

    let results = await vault.search(searchRequest, 0, 10)
    assert(results.length == 3)

    results.some( function(result){ return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user1.getId() })
    results.some( function(result){ return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user2.getId() })
    results.some( function(result){ return result.getAttribute() == attributeDef2.getName() && result.getUserId() == user2.getId() })

    done();
  })



});
