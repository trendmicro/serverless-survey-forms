'use strict';

let expect = require('chai').expect;
let should = require('chai').should();
let init = require('./init-test'),
    userjs = init.userjs;

describe("Interface to add one new user model into data store", () => {
  describe("#addOneUser successfully", () => {
    describe("When adding one new user model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User",
        };
        userjs.addOneUser(event).then(response => {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });

  describe("#addOneUser with error", () => {
    let missingParams = [
      {
        desc: "with missing event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username and event.email",
        event: {
          accountid: "this is fake account",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username and event.role",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.username",
        event: {
          email: "this is fake email",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.email",
        event: {
          username: "this is fake user name",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.role",
        event: {
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role and event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
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
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with wrong table",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User",
        },
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When adding one new user model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_USERTABLE = "XXX";
          userjs.addOneUser(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", done => {
      process.env.SERVERLESS_USERTABLE = 'usertable';
      done();
    });
  });
});

describe("Interface to get one user model from data store", () => {
  let accountid = "this is dummy account",
    username = "this is dummy user name",
    email = "this is dummy email",
    role = "this is dummy User";

  before("Insert one dummy record", done => {
    let event = {
      accountid: accountid,
      username: username,
      email: email,
      role: role
    };
    userjs.addOneUser(event).then(() => {
      done();
    }).catch(err => {
      throw err;
    });
  });

  describe("#getOneUser successfully", () => {
    describe("When getting exist user model with complete and normal parameters", () => {
      let event = {
        accountid: accountid,
      };
      it("should response successfully", done => {
        userjs.getOneUser(event).then(response => {
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

  describe("#getOneUser with error", () => {
    let missingParams = [
      {
        desc: "with not match any event.accountid",
        event: {
          accountid: 'not match any event.accountid'
        },
        expect: /Error: 404 Not Found/
      },
      {
        desc: "with missing event.accountid",
        event: {},
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with wrong table",
        event: {
          accountid: 'not match any event.accountid'
        },
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When getting one user model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_USERTABLE = "XXX";
          userjs.getOneUser(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", done => {
      process.env.SERVERLESS_USERTABLE = 'usertable';
      done();
    });
  });
});

describe("Interface to get list users model from data store", () => {
  describe("#listUsers successfully", () => {
    describe("When getting exist users model with complete and normal parameters", () => {
      let event = {};
      it("should response successfully", done => {
        userjs.listUsers(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.keys('users');
          response.users.length.should.equal(2); // There are two users data in above test case
          response.users.map(obj => {
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
      it("should response successfully", done => {
        const limitTestCase = event => {
          userjs.listUsers(event).then(response => {
            if (typeof response.LastEvaluatedKey != "undefined") {
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
    let params = {
      desc: "with wrong table",
      event: {},
      expect: /Error: 400 Bad Request/,
    };

    describe("When getting user list " + params.desc + " (Table not exist)", () => {
      it("should response error", done => {
        process.env.SERVERLESS_USERTABLE = "XXX";
        userjs.listUsers(params.event).catch(error => {
          expect(error).to.not.be.null;
          error.should.match(RegExp(params.expect));
          done();
        });
      });
    });

    describe("When getting list users mode " + params.desc + " (False condition)", () => {
      it("should response error", done => {
        delete process.env.SERVERLESS_USERTABLE;
        userjs.listUsers(params.event).catch(error => {
          expect(error).to.not.be.null;
          error.should.match(RegExp(params.expect));
          done();
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", done => {
      process.env['SERVERLESS_USERTABLE'] = 'usertable';
      done();
    });
  });
});

describe("Interface to calculate user count from data store", () => {
  describe("#countUser successfully", () => {
    describe("When getting exist user model with complete and normal parameters", () => {
      it("should response successfully", done => {
        userjs.countUser({}).then(response => {
          expect(response).to.not.be.null;
          response.should.have.all.keys(['Count', 'ScannedCount']);
          expect(response.Count).to.equal(2);  // Data store have two record.
          expect(response.ScannedCount).to.equal(2);
          done();
        });
      });
    });
  });

  describe("#countUser with error", () => {
    describe("When getting exist user model with wrong table (Table not exist)", () => {
      it("should response error", done => {
        process.env.SERVERLESS_USERTABLE = "XXX"
        userjs.countUser({}).catch(error => {
          expect(error).to.not.be.null;
          error.should.match(RegExp(/Error: 400 Bad Request/));
          done();
        });
      });
    });

    describe("When getting exist user model with wrong table (False condition)", () => {
      it("should response error", done => {
        delete process.env.SERVERLESS_USERTABLE;
        userjs.countUser({}).catch(error => {
          expect(error).to.not.be.null;
          error.should.match(RegExp(/Error: 400 Bad Request/));
          done();
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", done => {
      process.env.SERVERLESS_USERTABLE = "usertable";
      done();
    });
  });
});

describe("Interface to update one user model in data store", () => {
  describe("#updateOneUser successfully", () => {
    describe("When updating one exist user model with complete and normal parameters", () => {
      it("should response successfully", () => {
        let event = {
          accountid: "this is fake account",
          username: "this is true user name",
          email: "this is true email",
          role: "this is true User",
        };
        userjs.updateOneUser(event).then(response => {
          expect(response).to.not.be.null;
        });
      });
    });
  });

  describe("#updateOneUser with error", () => {
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
      {
        desc: "with missing event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          username: "this is fake user name",
          email: "this is fake email",
          role: "this is fake User"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username and event.email",
        event: {
          accountid: "this is fake account",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.username and event.role",
        event: {
          accountid: "this is fake account",
          email: "this is fake email",
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.username",
        event: {
          email: "this is fake email",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.email",
        event: {
          username: "this is fake user name",
          role: "this is fake role"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.role",
        event: {
          username: "this is fake user name",
          email: "this is fake email"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.role and event.email",
        event: {
          accountid: "this is fake account",
          username: "this is fake user name"
        },
        expect: /Error: 400 Bad Request/
      },
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
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When updating one user model " + test.desc, () => {
        it("should response error", done => {
          userjs.updateOneUser(test.event).catch(error => {
            expect(error).to.not.be.null;
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

  before("Insert one dummy record", done => {
    let event = {
      accountid: accountid,
      username: username,
      email: email,
      role: role
    };
    userjs.addOneUser(event).then(() => {
      done();
    }).catch(err => {
      throw err;
    });
  });

  describe("#deleteOneUser successfully", () => {
    describe("When deleting exist user model with complete and normal parameters", () => {
      it("should response successfully", () => {
        let event = {
          accountid: accountid,
          expect: /Error: 404 Not Found/
        };
        return new Promise((resolve, reject) => {
          userjs.deleteOneUser(event).then(response => {
            expect(response).to.not.be.null;
            resolve(event);
          });
        }).then(event => {
          userjs.getOneUser(event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(event.expect));
          });
        });
      });
    });
    describe("When deleting non-exist user model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: 'non-exist accountid',
        };
        userjs.deleteOneUser(event).then(response => {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });

  describe("#deleteOneUser with error", () => {
    let missingParams = [
      {
        desc: "with missing event.accountid",
        event: {},
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with wrong table",
        event: {accountid: "this is fake account"},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When deleting one user model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_USERTABLE = "123";
          userjs.deleteOneUser(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_USERTABLE usertable", done => {
      process.env.SERVERLESS_USERTABLE = 'usertable';
      done();
    });
  });
});