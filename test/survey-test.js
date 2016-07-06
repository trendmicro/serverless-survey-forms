'use strict';

let expect = require('chai').expect;
let should = require('chai').should();

// require testing target and set up necessary information
let aws = require('aws-sdk');
let survey = require('../api/survey/survey.js');
let dynadblib = require('./dynadb');
let dynadb = new dynadblib();

before('Initial local DynamoDB', function(done) {
  // set up necessary information
  process.env['SERVERLESS_SURVEYTABLE'] = 'surveytable';
  let dynalitePort = 1234;
  /////////////////////////////////////////////////////////////////////

  // Returns a standard Node.js HTTP server
  dynadb.listen(dynalitePort, function(err) {
    if (err) throw err;

    // create user table
    aws.config.update({
      accessKeyId: "accessKeyId",
      secretAccessKey: "secretAccessKey",
      region: 'us-east-1',
      endpoint: 'http://localhost:' + dynalitePort
    });

    survey.initAWS(aws);

    let dynamodb = new aws.DynamoDB({
      apiVersion: '2012-08-10'
    });

    let params = {
      TableName: process.env.SERVERLESS_SURVEYTABLE,
      AttributeDefinitions: [{
        AttributeName: "accountid",
        AttributeType: "S"
      }, {
        AttributeName: "surveyid",
        AttributeType: "S"
      }],
      KeySchema: [{
        AttributeName: "accountid",
        KeyType: "HASH"
      }, {
        AttributeName: "surveyid",
        KeyType: "RANGE"
      }],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };
    dynamodb.createTable(params, function(err, data) {
      if (err) throw err;
      done();
    });
  });
  /////////////////////////////////////////////////////////////////////
});

after('Uninitial local DynamoDB', function(done) {
  dynadb.close(done);
});

describe("Interface to add one new survey model into data store", function() {
  describe("#addOneSurvey successfully", function() {
    describe("When adding one new survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: "this is fake account",
          subject: "this is fake subject",
          survey: "this is fake survey model"
        };
        survey.addOneSurvey(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'surveyid', 'datetime']);
          response.accountid.should.have.string(event.accountid);
          response.surveyid.should.have.length.above(0);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#addOneSurvey with error", function() {
    // missing parameter(s)
    let missingParams = [
      // one parameter
      {
        desc: "with missing event.survey",
        event: {
          accountid: "this is fake account",
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.subject",
        event: {
          accountid: "this is fake account",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          subject: "this is fake subject",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.subject and event.survey",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.survey",
        event: {
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.subject",
        event: {
          survey: "this is fake survey model"
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
      describe("When adding one new survey model " + test.desc, function() {
        it("should response error", function(done) {
          survey.addOneSurvey(test.event, function(error, response) {
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

describe("Interface to get one survey model from data store", function() {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let surveyid = null;

  before("Insert one dummy record", function(done) {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel
    };
    survey.addOneSurvey(event, function(err, data) {
      if (err) throw err;
      surveyid = data.surveyid;
      done();
    });
  });

  describe("#getOneSurvey successfully", function() {
    describe("When getting exist survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: accountid,
          surveyid: surveyid
        };
        survey.getOneSurvey(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'surveyid', 'subject', 'datetime', 'survey']);
          response.accountid.should.have.string(accountid);
          response.surveyid.should.have.string(surveyid);
          response.subject.should.have.string(subject);
          response.survey.should.have.string(surveymodel);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#getOneSurvey with error", function() {
    let missingParams = [
      // one parameter
      {
        desc: "with not match any event.accountid",
        event: {
          accountid: "Not match",
          surveyid: "this is fake survey id"
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      {
        desc: "with missing event.surveyid",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          surveyid: "this is fake survey id"
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
      describe("When getting one survey model " + test.desc, function() {
        it("should response error", function(done) {
          //let obj = new survey(aws);
          survey.getOneSurvey(test.event, function(error, response) {
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

describe("Interface to get list survey model from data store", function() {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveyid = null;

  describe("#listSurveys successfully", function() {
    describe("When getting exist survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: accountid,
        };
        survey.listSurveys(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.keys('surveys');
          response.surveys.length.should.equal(2); // There are two survey model in above test case.
          response.surveys.map((obj) => {
            obj.should.have.keys(['accountid', 'surveyid', 'subject', 'datetime']);
            obj.accountid.should.exist;
            obj.surveyid.should.exist;
            obj.subject.should.exist;
            obj.datetime.should.exist;
          });
          done();
        });
      });
    });
    describe("When getting exist survey model with startKey parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: accountid,
          authAccountid: "this is fake authAccountid",
          limitTesting: true,
        };
        const limitTestCase = (event) => {
          survey.listSurveys(event, function(error, response) {
            if(typeof response.LastEvaluatedKey != "undefined"){
              expect(error).to.be.null;
              expect(response).to.not.be.null;
              response.should.have.keys(['surveys', 'LastEvaluatedKey']);
              response.surveys.length.should.equal(1); // There is one survey model because setting limit is 1.
              response.surveys.map((obj) => {
                obj.should.have.keys(['accountid', 'surveyid', 'subject', 'datetime']);
                obj.surveyid.should.exist;
                obj.accountid.should.exist;
                obj.subject.should.exist;
                obj.datetime.should.exist;
              });

              // recursive
              event.startKey = response.LastEvaluatedKey;
              limitTestCase(event);
            }else{
              done();
            }
          });
        };
        limitTestCase(event);
      });
    });
  });
  describe("#listSurveys with error", function() {

    // missing parameter(s)
    let missingParams = [
      {
        desc: "with missing event.accountid",
        event: {
          authAccountid: "this is fake authAccountid"
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
      describe("When getting list survey model " + test.desc, function() {
        it("should response error", function(done) {
          survey.listSurveys(test.event, function(error, response) {
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

describe("Interface to update one survey model in data store", function() {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let surveyid = null;

  before("Insert one dummy record", function(done) {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel
    };
    survey.addOneSurvey(event, function(err, data) {
      if (err) throw err;
      surveyid = data.surveyid;
      done();
    });
  });

  describe("#updateOneSurvey successfully", function() {
    describe("When updating one exist survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: "this is fake account",
          subject: "this is a modified subject",
          survey: "this is modified fake survey model",
          surveyid: surveyid
        };
        survey.updateOneSurvey(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['datetime']);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#updateOneSurvey with error", function() {
    let errorParams = [
      {
        desc: "with non exist Survey data",
        event: {
          accountid: "not found",
          subject: "this is a modified subject",
          survey: "this is modified fake survey model",
          surveyid: "not found"
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      // one parameter
      {
        desc: "with missing event.survey",
        event: {
          accountid: "this is fake account",
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.subject",
        event: {
          accountid: "this is fake account",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          subject: "this is fake subject",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.subject and event.survey",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.survey",
        event: {
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid and event.subject",
        event: {
          survey: "this is fake survey model"
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
    errorParams.forEach(function(test) {
      describe("When updating one survey model " + test.desc, function() {
        it("should response error", function(done) {
          survey.updateOneSurvey(test.event, function(error, response) {
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

describe("Interface to delete one survey model from data store", function() {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let surveyid = null;

  before("Insert one dummy record", function(done) {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel
    };
    survey.addOneSurvey(event, function(err, data) {
      if (err) throw err;
      surveyid = data.surveyid;
      done();
    });
  });

  describe("#deleteOneSurvey successfully", function() {
    describe("When deleting exist survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: accountid,
          surveyid: surveyid
        };
        survey.deleteOneSurvey(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          done();
        });
      });
    });
    describe("When deleting non-exist survey model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          accountid: 'non-exist accountid',
          surveyid: 'non-exist surveyid'
        };
        survey.deleteOneSurvey(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });

  describe("#deleteOneSurvey with error", function() {
    // missing parameter(s)
    let missingParams = [
      // one parameter
      {
        desc: "with missing event.surveyid",
        event: {
          accountid: "this is fake account",
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.accountid",
        event: {
          surveyid: "this is fake survey model"
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
      describe("When deleting one survey model " + test.desc, function() {
        it("should response error", function(done) {
          survey.deleteOneSurvey(test.event, function(error, response) {
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
