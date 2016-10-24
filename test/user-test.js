'use strict';

let expect = require('chai').expect;
let should = require('chai').should();
let init = require('./init-test'),
    userjs = init.userjs;

describe("Interface to add one new user model into data store", function() {
  describe("#addOneUser successfully", function() {
    describe("When adding one new user model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User",
        };
        userjs.addOneUser(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });
  describe("#addOneUser with error", function() {
    // missing parameter(s)
    let missingParams = [
      // one parameter
      {
        desc: "with missing event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.username",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.role",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.username and event.email",
        event: {
          accountid: "this is fake account",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.username and event.role",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.username",
        event: {
          email: "this is fake email",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.email",
        event: {
          username: "this is fake user name",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },{
        desc: "with missing event.accountid and event.role",
        event: {
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.role and event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
      // three parameters
      {
        desc: "with missing event.role, event.accountid and event.email",
        event: {
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role, event.username and event.email",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username, event.accountid and event.email",
        event: {
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username, event.accountid and event.role",
        event: {
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      // all parameters
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(function(test) {
      describe("When adding one new user model " + test.desc, function() {
        it("should response error", function(done) {
          userjs.addOneUser(test.event, function(error, response) {
            expect(error).to.not.be.null;
            expect(response).to.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });
  });
});

describe("Interface to get one user model from data store", function() {
  let accountid = "this is dummy account",
    username = "this is dummy user name",
    email = "this is dummy email",
    role = "this is dummy User";

  before("Insert one dummy record", function(done) {
    let event = {
      accountid: accountid,
      username: username,
      email: email,
      role: role
    };
    userjs.addOneUser(event, function(err, data) {
      if (err) throw err;
      done();
    });
  });

  describe("#getOneUser successfully", function() {
    describe("When getting exist user model with complete and normal parameters", function() {
      let event = {
        accountid: accountid,
      };
      it("should response successfully", (done) => {
        userjs.getOneUser(event, (error, response) => {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'username', 'role']);
          response.accountid.should.have.string(accountid);
          response.username.should.have.string(username);
          response.role.should.have.string(role);
          done();
        });
      });
    });
  });
  describe("#getOneUser with error", function() {
    let missingParams = [
      {
        desc: "with not match any event.accountid",
        event: {
          accountid: 'not match any event.accountid'
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      // one parameter
      {
        desc: "with missing event.accountid",
        event: {},
        expect: /Error: 400 Bad Request/
      },
    ];

    missingParams.forEach(function(test) {
      describe("When getting one user model " + test.desc, function() {
        it("should response error", (done) => {
          userjs.getOneUser(test.event, (error, response) => {
            expect(error).to.not.be.null;
            expect(response).to.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });
  });
});

describe("Interface to get list users model from data store", () => {
  describe("#listUsers successfully", () => {
    describe("When getting exist users model with complete and normal parameters", () => {
      let event = {};
      it("should response successfully", (done) => {
        userjs.listUsers(event, (error, response) => {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.keys('users');
          response.users.length.should.equal(2); // There are two users data in above test case
          response.users.map((obj) => {
            obj.should.have.keys(['accountid', 'username', 'email', 'role']);
            obj.accountid.should.exist;
            obj.username.should.exist;
            obj.email.should.exist;
            obj.role.should.exist;
          });
          done();
        });
      });
    });

    describe("When getting exist users model with startKey parameters", () => {
      let event = {
        limitTesting: true,
      };
      it("should response successfully", (done) => {
        const limitTestCase = (event) => {
          userjs.listUsers(event, (error, response) => {
            if (typeof response.LastEvaluatedKey != "undefined") {
              expect(error).to.be.null;
              expect(response).to.not.be.null;
              response.should.have.keys(['users', 'LastEvaluatedKey']);
              response.users.length.should.equal(1); // There is one user data because setting limit is 1.
              response.users.map((obj) => {
                obj.should.have.keys(['accountid', 'username', 'email', 'role']);
                obj.accountid.should.exist;
                obj.username.should.exist;
                obj.email.should.exist;
                obj.role.should.exist;
              });
              // recursive
              event.startKey = response.LastEvaluatedKey;
              limitTestCase(event);
            } else {
              done();
            }
          });
        };
        limitTestCase(event);
      });
    });
  });

  describe("#listUsers with error", () => {
    let params =
    {
      desc: "with wrong setting",
      event: {},
      expect: /Error: 400 Bad Request/
    };

    before("For 400, set SERVERLESS_USERTABLE null", (done) => {
      process.env['SERVERLESS_USERTABLE'] = null;
      done();
    });

    describe("When getting list users mode " + params.desc, () => {
      it("should response error", (done) => {
        userjs.listUsers(params.event, (error, response) => {
          expect(error).to.not.be.null;
          expect(response).to.be.null;
          error.should.match(RegExp(params.expect));
          done();
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", (done) => {
      process.env['SERVERLESS_USERTABLE'] = 'usertable';
      done();
    });
  });
});

describe("Interface to calculate user count from data store", function() {
  describe("#countUser successfully", function() {
    describe("When getting exist user model with complete and normal parameters", function() {
      it("should response successfully", (done) => {
        userjs.countUser({}, (error, response) => {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['Count', 'ScannedCount']);
          expect(response.Count).to.equal(2);  // Data store have two record.
          expect(response.ScannedCount).to.equal(2);
          done();
        });
      });
    });
  });
});

describe("Interface to update one user model in data store", function() {
  describe("#updateOneUser successfully", function() {
    describe("When updating one exist user model with complete and normal parameters", function() {
      it("should response successfully", function() {
        let event = {
          accountid: "this is fake account",
          username: "this is true user name",
          email: "this is true email",
          role: "this is true User",
        };
        userjs.updateOneUser(event, (error, response) => {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
        });
      });
    });
  });
  describe("#updateOneUser with error", function() {
    let missingParams = [
      {
        desc: "with not exist user model in data store",
        event: {
          accountid: "not found",
          username: "this is true user name",
          email: "this is true email",
          role: "this is true User",
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      // one parameter
      {
        desc: "with missing event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.username",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.role",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.username and event.email",
        event: {
          accountid: "this is fake account",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.username and event.role",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.username",
        event: {
          email: "this is fake email",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.email",
        event: {
          username: "this is fake user name",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },{
        desc: "with missing event.accountid and event.role",
        event: {
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.role and event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
      // three parameters
      {
        desc: "with missing event.role, event.accountid and event.email",
        event: {
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role, event.username and event.email",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username, event.accountid and event.email",
        event: {
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username, event.accountid and event.role",
        event: {
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      // all parameters
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(function(test) {
      describe("When updating one user model " + test.desc, function() {
        it("should response error", function(done) {
          userjs.updateOneUser(test.event, function(error, response) {
            expect(error).to.not.be.null;
            expect(response).to.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });
  });
});

describe("Interface to delete one user model from data store", () => {
  let accountid = "this is dummy account",
    username = "this is dummy user name",
    email = "this is dummy email",
    role = "this is dummy User";

  before("Insert one dummy record", function(done) {
    let event = {
      accountid: accountid,
      username: username,
      email: email,
      role: role
    };
    userjs.addOneUser(event, function(err, data) {
      if (err) throw err;
      done();
    });
  });

  describe("#deleteOneUser successfully", () => {
    describe("When deleting exist user model with complete and normal parameters", () => {
      it("should response successfully", function() {
        let event = {
          accountid: accountid,
          expect: /Error: 404 Not Found/
        };
        return new Promise((resolve, reject) => {
          userjs.deleteOneUser(event, function (error, response) {
            expect(error).to.be.null;
            expect(response).to.not.be.null;
            resolve(event);
          });
        }).then( (event) => {
          return userjs.getOneUser(event, (error, response) => {
            expect(error).to.not.be.null;
            expect(response).to.be.null;
            error.should.match(RegExp(event.expect));
          });
        });
      });
    });
    describe("When deleting non-exist user model with complete and normal parameters", () => {
      it("should response successfully", function(done) {
        let event = {
          accountid: 'non-exist accountid',
        };
        userjs.deleteOneUser(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });

  describe("#deleteOneUser with error", () => {
    let missingParams = [
      // missing parameter(s)
      // one parameter
      {
        desc: "with missing event.accountid",
        event: {},
        expect: /Error: 400 Bad Request/
      },
    ];

    missingParams.forEach(function(test) {
      describe("When deleting one user model " + test.desc, function() {
        it("should response error", (done) => {
          userjs.getOneUser(test.event, (error, response) => {
            expect(error).to.not.be.null;
            expect(response).to.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

  });
});