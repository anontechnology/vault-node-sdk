const assert = require('assert');
const lodash = require('lodash');
import {ViziVault} from "../ViziVault";
import {AttributeDefinition} from "../AttributeDefinition";
import {User} from "../User";
import {Attribute} from "../Attribute";
import {SearchRequest} from "../SearchRequest";
import {Tag} from "../Tag";
import {Regulation} from "../Regulation";
import {ConjunctiveRule} from "../tagging/ConjunctiveRule";
import {AttributeListOperator, AttributeRule} from "../tagging/AttributeRule";
import {UserValuePredicate, UserRule} from "../tagging/UserRule";
//import {VaultException} from "../VaultException";



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
      assert(attribute1.getValue() == testUser.getAttribute(attributeDef1.getName()).getValue())
      assert(testUser.getAttributes().length == 3)
      assert(testUser.getAttributes(attributeDef2.getName()).length == 2);

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

  it('Test Search', async function () {

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
      searchRequest.setAttributes([attributeDef2.getName()]);

      let results = await vault.search(searchRequest, 0, 10)
      assert(results.length == 3)

      assert(results.some(function (result) {
        return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user1.getId()
      }) == true);
      assert(results.some(function (result) {
        return result.getAttribute() == attributeDef1.getName() && result.getUserId() == user2.getId()
      }) == true);
      results.some(function (result) {
        return result.getAttribute() == attributeDef2.getName() && result.getUserId() == user2.getId()
      })
    } catch (e) {
      await vault.purge(username);
      await vault.purge(secondUsername);
      console.log(e);
      throw (e);
    }
  })



  it('Get Attribute by Datapoint ID', async function () {
    let attributeDef1 = new AttributeDefinition("TestAttribute1");
    await vault.storeAttributeDefinition(attributeDef1);
    let sentUser = new User(username);
    sentUser.buildAttribute(attributeDef1.getName(), "some data");
    await vault.save(sentUser);
    let receivedUser = await vault.findByUser(sentUser.getId());
    let receivedAttribute = await receivedUser.getAttribute(attributeDef1.getName());
    assert(lodash.isEqual(receivedAttribute, await vault.getDataPoint(receivedAttribute.getDataPointId())));
  })

  it('Test Tags', async function () {
    let attributeDef1 = new AttributeDefinition("TestAttribute1")
    attributeDef1.setTags(["tag1"])
    await vault.storeAttributeDefinition(attributeDef1);

    let sentUser = new User(username);
    sentUser.setTags(["tag2"]);

    let attribute1 = new Attribute(attributeDef1.getName());
    attribute1.setTags(["tag3"]);
    sentUser.addAttribute(attribute1, 'common first name');

    try {
      await vault.save(sentUser);

      let receivedUser = await vault.findByUser(username) as User;
      let receivedAttribute = await receivedUser.getAttribute(attributeDef1.getName());

      assert(receivedAttribute.getTags().length == 3);
      assert(receivedAttribute.getTags().some(function (tag) {
        return tag == "tag1"
      }) == true);
      assert(receivedAttribute.getTags().some(function (tag) {
        return tag == "tag2"
      }) == true);
      assert(receivedAttribute.getTags().some(function (tag) {
        return tag == "tag3"
      }) == true);

      let tag4 = new Tag("tag4");
      await vault.storeTag(tag4);

      let allTags = await vault.getTags() as Array<Tag>;
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag1"
      }) == true);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag2"
      }) == true);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag3"
      }) == true);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag4"
      }) == true);

      await vault.deleteTag("tag1");
      await vault.deleteTag("tag2");
      await vault.deleteTag("tag3");
      await vault.deleteTag("tag4");

      try {
        await vault.getTag("tag5")
      } catch (e) {
        assert( (e.message == "Something went wrong." && e.statusCode == 418) == true)
        return "";
      }

      assert(await vault.deleteTag("tag5") == false);

      allTags = await vault.getTags();
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag1"
      }) == false);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag2"
      }) == false);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag3"
      }) == false);
      assert(allTags.some(function (tag) {
        return tag.getName() == "tag4"
      }) == false);

    } catch (e) {
      await vault.purge(username);
      console.log(e);
      throw(e);
    }

  })

  it('Test Regulations', async function () {

    let regulation = new Regulation();
    regulation.setName("Regulation Name");
    regulation.setKey("RegulationKey");

    let attributeDef1 = new AttributeDefinition("TestAttribute1");
    await vault.storeAttributeDefinition(attributeDef1);

    let rootRule = new ConjunctiveRule();
    rootRule.addRule(new AttributeRule([attributeDef1.getName()], AttributeListOperator.ANY));
    rootRule.addRule(new UserRule(attributeDef1.getName(), UserValuePredicate.EQUALS, "Test Attribute Value"));

    regulation.setRule(rootRule);
    await vault.storeRegulation(regulation);

    let receivedRegulation = await vault.getRegulation(regulation.getKey() as string);

    assert(regulation.getName(), receivedRegulation.getName())

    let allRegulations = await vault.getRegulations()
    assert(allRegulations.some(function (thisRegulation) {
      return thisRegulation.getName() == regulation.getName();
    }) == true);

    await vault.deleteRegulation(regulation.getKey() as string);

    assert(allRegulations.some(function (thisRegulation) {
      return thisRegulation.getName() == regulation.getName();
    }) == true);
  })



});
