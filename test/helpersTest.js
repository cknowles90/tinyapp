const { assert } = require('chai');

const { getUserByEmail, getUserUrls } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123454321"
  },
  "userRandomID2": {
    id: "userRandomID2",
    email: "user2@example.com",
    password: "password"
  }
};

const testUrlDatabase = {
  userRandomID: {
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
},
  userRandomID2: {
    longURL: "http://www.google.com",
    userID: "userRandomID2",
},
};

          // TESTING, TESTING, ONE TWO.... THREE //

describe('#getUserByEmail', () => {
  it('should return a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";
    assert.strictEqual(user.id, expectedUserID);
  });

  it('should return a user object when it\'s provided with an email that exists in the database', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    assert.strictEqual(user.email, "user@example.com");
  });

  it('should return undefined when an email that does not exist is passed through', function() {
    const user = getUserByEmail(testUsers, "thisisntanemail@example.com");
    assert.isUndefined(user, "This email doesnt exist!");
  });
});

describe('#getUserUrl', () => {
  it('it should return the URL if the user has the URL', () => {
    const urls = getUserUrls(testUrlDatabase, "userRandomID");
    const expectedURL = {
      longURL: "http://www.lighthouselabs.ca",
      userID: "userRandomID"
    }
    assert.deepStrictEqual(urls["userRandomID"], expectedURL);
  });

  it('should return an empty object if the user does not exist in the database', () => {
    const urls = getUserUrls(testUrlDatabase, "userRandomID4");
    assert.deepStrictEqual(urls, {});
  });

  it('should return undefined if the user has no URLs', () => {
    const urls = getUserUrls(testUrlDatabase, "userRandomID4");
    assert.deepEqual(urls, {});
  });
});

