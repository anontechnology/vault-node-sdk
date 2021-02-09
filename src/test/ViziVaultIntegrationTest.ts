const assert = require('assert');

import {ViziVault} from "../ViziVault";
import {AttributeDefinition} from "../AttributeDefinition";
import {User} from "../User";
import {Attribute} from "../Attribute";
import {SearchRequest} from "../SearchRequest";


const fs = require('fs')


describe('Integration Tests:', function () {

  let encryptionKey = fs.readFileSync('./src/test/resources/encryptionKey.txt', 'utf8');
  let decryptionKey = fs.readFileSync('./src/test/resources/decryptionKey.txt', 'utf8');

  let vault = new ViziVault().withBaseURL(new URL("http://localhost:8083"))
    .withApiKey("aaa")
    .withEncryptionKey(encryptionKey)
    .withDecryptionKey(decryptionKey);

  let username = 'exampleUser';
  let secondUsername = 'exampleUser2'


  afterEach(function (done) {
    vault.purge('exampleUser');
    vault.purge('exampleUser2');
    done();
  });


  it('Load and retrieve data from vault', async function () {
    let sentUser = new User(username)
    let attributeDef1 = new AttributeDefinition("TestAttribute1")
    let attributeDef2 = new AttributeDefinition("TestAttribute2")

    try {
      attributeDef2.setRepeatable(true);

      await vault.storeAttributeDefinition(attributeDef1);
      await vault.storeAttributeDefinition(attributeDef2);

      let attribute1 = new Attribute().withAttribute(attributeDef1.getName()).withValue("exampleUser's first name")

      sentUser.setAttribute(attribute1);
      sentUser.buildAttribute(attributeDef2.getName(), "exampleUser's last name'");
      sentUser.buildAttribute(attributeDef2.getName(), "exampleUser's other last name'");
      await vault.save(sentUser)

      let testUser = await vault.findByUser(username) as User
      assert(attribute1.getValue() == testUser.getAttribute(attributeDef1.getName())[0].getValue())
      assert(testUser.getAttributes().length == 3)
      assert(testUser.getAttribute(attributeDef2.getName()).length == 2);

      // Remove one Attribute
      testUser.clearAttribute(attributeDef1.getName());
      await vault.save(testUser)


      let receivedUserAfterDeletion = await vault.findByUser(username)
      assert(receivedUserAfterDeletion.getAttribute(attributeDef1.getName()) == null)
    } catch (e) {
      await vault.purge('exampleUser');
      console.log(e);
      return "";
    }

  });

  it('testSearch', async function () {
    let attributeDef1 = new AttributeDefinition("TestAttribute1")
    attributeDef1.setIndexed(true);
    let attributeDef2 = new AttributeDefinition("TestAttribute2")
    attributeDef2.setRepeatable(true);


    try {
      await vault.storeAttributeDefinition(attributeDef1);
      await vault.storeAttributeDefinition(attributeDef2);

      let user1 = new User(username);
      user1.buildAttribute(attributeDef1.getName(), "common first name")
      await vault.save(user1);

      let user2 = new User(secondUsername);
      user2.buildAttribute(attributeDef1.getName(), "common first name")
      user2.buildAttribute(attributeDef2.getName(), "user2's last name")
      await vault.save(user2);

      let searchRequest = new SearchRequest();
      searchRequest.addValueQuery(attributeDef1.getName(), "common first name")
      searchRequest.setAttributes(  [attributeDef2.getName()] );

      let results = await vault.search(searchRequest, 0, 10)
      assert(results.length == 3)

      assert( results.some(function (result) {
        return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user1.getId()
      }) == true);
      assert ( results.some(function (result) {
        return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user2.getId()
      }) == true);
      results.some(function (result) {
        return result.getAttribute() == attributeDef2.getName() && result.getUserId() == user2.getId()
      })
    } catch (e) {
      await vault.purge(username);
      await vault.purge(secondUsername);
      console.log(e);
      return "";
    }

  })


});
