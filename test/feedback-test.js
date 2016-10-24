'use strict';

let expect = require('chai').expect;
let should = require('chai').should();
let init = require('./init-test'),
    surveyjs = init.surveyjs,
    feedbackjs = init.feedbackjs;

describe("Interface to add one new feedback model into data store", function() {
  let event = {
    surveyid: "Fake surveyid",
    clientid: "1st clientid",
    feedback: "1st feedback"
  };
  describe("#addOneFeedback successfully", function() {
    describe("When adding one new feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {

        feedbackjs.addOneFeedback(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys('datetime');
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#addOneFeedback with error", function() {
    // missing parameter(s)
    let missingParams = [
      // one parameter
      {
        desc: "with missing event.feedback",
        event: {
          clientid: event.clientid,
          surveyid: event.surveyid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid",
        event: {
          clientid: event.clientid,
          feedback: event.feedback
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.clientid",
        event: {
          surveyid: event.surveyid,
          feedback: event.feedback
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.clientid and event.feedback",
        event: {
          surveyid: event.surveyid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid and event.feedback",
        event: {
          clientid: event.clientid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid and event.clientid",
        event: {
          feedback: event.feedback
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
      describe("When adding one new feedback model " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.addOneFeedback(test.event, function(error, response) {
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

/*
[
  {surveyid: "Fake surveyid", clientid: "1st clientid" ...}
]
*/

describe("Interface to get one feedback model from data store", function() {
  let event = {
    surveyid: "Fake surveyid",
    clientid: "2nd clientid",
    feedback: "2nd feedback"
  };
  before("Insert one dummy record", function(done) {
    feedbackjs.addOneFeedback(event, function(err, data) {
      if (err) throw err;
      done();
    });
  });
  describe("#getOneFeedback successfully", function() {
    describe("When getting exist feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        feedbackjs.getOneFeedback(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['clientid', 'surveyid', 'feedback', 'datetime']);
          response.clientid.should.have.string(event.clientid);
          response.surveyid.should.have.string(event.surveyid);
          response.feedback.should.have.string(event.feedback);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#getOneFeedback with error", function() {
    let missingParams = [
      // one parameter
      {
        desc: "with not match any event.clientid",
        event: {
          clientid: "Not match",
          surveyid: event.surveyid
        },
        expect: /Error: 404 Not Found/
      },
      {
        desc: "with not match any event.surveyid",
        event: {
          clientid: event.clientid,
          surveyid: "Not match"
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      {
        desc: "with missing event.surveyid",
        event: {
          clientid: event.clientid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.clientid",
        event: {
          surveyid: event.surveyid
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
      describe("When getting one feedback model " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.getOneFeedback(test.event, function(error, response) {
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

/*
[
  {surveyid: "Fake surveyid", clientid: "1st clientid" ...},
  {surveyid: "Fake surveyid", clientid: "2nd clientid" ...}
]
*/

describe("Interface to get total feedback number in a survey from data store", function() {
  let surveyid = "Fake surveyid";
  describe("#countFeedbacks successfully", function() {
    describe("When getting total feedback number in a survey with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: surveyid,
        };
        feedbackjs.countFeedbacks(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['ScannedCount', 'Count']);
          response.ScannedCount.should.eql(2);
          response.Count.should.eql(2);
          done();
        });
      });
    });
  });
  describe("#countFeedbacks with error", function() {
    let missingParams = [
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(function(test) {
      describe("When getting total feedback number in a survey " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.countFeedbacks(test.event, function(error, response) {
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

/*
[
  {surveyid: "Fake surveyid", clientid: "1st clientid" ...},
  {surveyid: "Fake surveyid", clientid: "2nd clientid" ...}
]
*/

describe("Interface to get list feedback model from data store", function() {
  let surveyid = "Fake surveyid";
  describe("#listFeedbacks successfully", function() {
    describe("When getting exist feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: surveyid,
        };
        feedbackjs.listFeedbacks(event).then(function(response) {
          expect(response).to.not.be.null;
          response.should.have.keys('feedbacks');
          response.feedbacks.length.should.equal(2); // There are 2 feedback model in above test case.
          response.feedbacks.map((obj) => {
            obj.should.have.keys(['clientid', 'surveyid', 'datetime']);
            obj.clientid.should.exist;
            obj.surveyid.should.exist;
            obj.datetime.should.exist;
          });
          done();
        });
      });
    });
    describe("When getting exist feedback model with startKey parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: surveyid,
          limitTesting: true,
        };
        const limitTestCase = (event) => {
          feedbackjs.listFeedbacks(event).then(function(response) {
            if(typeof response.LastEvaluatedKey != "undefined"){
              expect(response).to.not.be.null;
              response.should.have.keys(['feedbacks', 'LastEvaluatedKey']);
              response.feedbacks.length.should.equal(1); // There is one feedback model because setting limit is 1.
              response.feedbacks.map((obj) => {
                obj.should.have.keys(['clientid', 'surveyid', 'datetime']);
                obj.clientid.should.exist;
                obj.surveyid.should.exist;
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
  describe("#listFeedbacks with error", function() {

    // missing parameter(s)
    let missingParams = [
      // all parameters
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(function(test) {
      describe("When getting list feedback model " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.listFeedbacks(test.event).catch(function(error) {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });
  });
});

/*
[
  {surveyid: "Fake surveyid", clientid: "1st clientid" ...},
  {surveyid: "Fake surveyid", clientid: "2nd clientid" ...}
]
*/

describe("Interface to update one feedback model from data store", function() {
  let event = {
    surveyid: "Fake surveyid",
    clientid: "1st clientid",
    feedback: "1st feedback(Modified)"
  };
  describe("#updateOneFeedback successfully", function() {
    describe("When updating one exist feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        feedbackjs.updateOneFeedback(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['feedback']);
          response.feedback.should.have.string(event.feedback);
          done();
        });
      });
    });
  });
  describe("#updateOneFeedback with error", function() {
    let errorParams = [
      {
        desc: "with non exist Feedback data",
        event: {
          clientid: "not found",
          feedback: event.feedback,
          surveyid: "not found"
        },
        expect: /Error: 404 Not Found/
      },
      // one parameter
      {
        desc: "with missing event.feedback",
        event: {
          clientid: event.clientid,
          surveyid: event.surveyid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid",
        event: {
          clientid: event.clientid,
          feedback: event.feedback
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.clientid",
        event: {
          surveyid: event.surveyid,
          feedback: event.feedback
        },
        expect: /Error: 400 Bad Request/
      },
      // two parameters
      {
        desc: "with missing event.clientid and event.feedback",
        event: {
          surveyid: event.surveyid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid and event.feedback",
        event: {
          clientid: event.clientid
        },
        expect: /Error: 400 Bad Request/
      }, {
        desc: "with missing event.surveyid and event.clientid",
        event: {
          feedback: event.feedback
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
      describe("When updating one feedback model " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.updateOneFeedback(test.event, function(error, response) {
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

/*
[
  {surveyid: "Fake surveyid", clientid: "1st clientid" ...},
  {surveyid: "Fake surveyid", clientid: "2nd clientid" ...}
]
*/

describe("Interface to delete feedback model from data store", function() {
  describe("#deleteOneFeedback successfully", function() {
    describe("When deleting exist feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: "Fake surveyid",
          clientid: "2nd clientid"
        };
        feedbackjs.deleteFeedbacks(event).then(function(response) {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
    /*
    [
      {surveyid: "Fake surveyid", clientid: "1st clientid" ...}
    ]
    */
    describe("When deleting non-exist feedback model with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          clientid: 'non-exist clientid',
          surveyid: 'non-exist surveyid'
        };
        feedbackjs.deleteFeedbacks(event).then(function(response) {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });
  describe("#deleteAllFeedbacks successfully", function() {
    before("Insert 30 dummy feebacks", function(done) {
      let success = 0
      for (var i = 0; i < 30; i++) {
        let event = {
          surveyid: "Fake surveyid",
          clientid: "clientid " + i,
          feedback: "feedback model",
        };
        feedbackjs.addOneFeedback(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys('datetime');
          response.datetime.should.be.above(0);
          success += 1;
          if (success === 30) done();
        });
      }
    });
    /*
    [
      {surveyid: "Fake surveyid", clientid: "1st clientid" ...}
      ...
      30 record added
      ...
    ]
    */
    describe("When deleting exist feedbacks with a surveyid", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: "Fake surveyid",
        };
        feedbackjs.listFeedbacks(event).then(function(response) {
          expect(response).to.not.be.null;
          response.should.have.keys('feedbacks');
          response.feedbacks.length.should.equal(31); // There are 31 feedbacks model in above test case. (include previous added)
          return feedbackjs.deleteFeedbacks(event);
        }).then(function(response) {
          expect(response).to.not.be.null;
          return feedbackjs.listFeedbacks(event);
        }).then(function(response) {
          expect(response).to.not.be.null;
          response.should.have.keys('feedbacks');
          response.feedbacks.length.should.equal(0); // There are 0 feedbacks model in above test case.
          done();
        });
      });
    });
    describe("When deleting non-exist feedbacks with a non-exist surveyid", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: 'non-exist surveyid',
        };
        feedbackjs.deleteFeedbacks(event).then(function(response) {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });
  describe("#deleteOneFeedback with error", function() {
    // missing parameter(s)
    let missingParams = [
      // one parameter
      {
        desc: "with missing event.surveyid",
        event: {
          clientid: "1st clientid",
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
      describe("When deleting one feedback model " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.deleteFeedbacks(test.event).catch(function(error) {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });
  });
});

describe("Interface to get one feedback CSV report from data store", function() {
  let accountid = "this is dummy accountid";
  let surveyid = "this is dummy surveyid";
  let subject = "this is dummy subject";
  let surveyContent = {
    "content": [
      {
        "page": 1,
        "description": "Untitle Page",
        "question": [
          {
            "id": "1APPGR9Q9J2CNNDTSVUXE",
            "order": 1,
            "data": [
              {
                "value": "1",
                "label": "Radio option 1"
              },
              {
                "value": "1APPGT35C1MY0O4LOL3UH",
                "label": "Radio option 2"
              },
              {
                "value": "1APPGTHVAZJAWBVN8H1JJ",
                "label": "Radio option 3"
              },
              {
                "input": "Please input your options.",
                "value": "1APPGTNPCICS772YVWOMK",
                "label": "Radio option 4"
              }
            ],
            "label": "Radio question label",
            "type": "radio",
            "required": true
          },
          {
            "id": "1APPGU85P3Q5O1867TTU1",
            "order": 2,
            "data": [
              {
                "value": "1",
                "label": "Checkbox option 1"
              },
              {
                "value": "1APPGUSH054A3SE6KSBAA",
                "label": "Checkbox option 2"
              },
              {
                "value": "1APPGV16961XPC85S6NNA",
                "label": "Checkbox option 3"
              },
              {
                "value": "1APPGV6DJ5TMJ3AAB4IXO",
                "label": "Checkbox option 4"
              },
              {
                "input": "Please input here.",
                "value": "1APPGVH3AKIG3DI5D63OY",
                "label": "Checkbo option 5 with input"
              }
            ],
            "label": "Checkbox question label",
            "type": "checkbox",
            "required": true
          }
        ]
      },
      {
        "page": 2,
        "description": "Untitle Page",
        "question": [
          {
            "id": "1APPH9K1JQE7N9HUM53F9",
            "input": "Tell me the reason.",
            "order": 3,
            "data": [
              {
                "value": "1",
                "label": "Scale 1"
              },
              {
                "value": "1APPHA1QGA80ASBNCAXZ7",
                "label": "Scale 2"
              },
              {
                "value": "1APPHA4N3N3F0H1T0RECW",
                "label": "Scale 3"
              },
              {
                "value": "1APPHA8G4K8ZL5EMS5DSX",
                "label": "Scale 4"
              },
              {
                "value": "1APPHABS4J29LGO58AAFW",
                "label": "Scale 5"
              }
            ],
            "label": "Rating question label",
            "type": "rating",
            "required": true
          }
        ]
      }
    ],
    "thankyou": {
      "description": "Thanks for sharing your feedback with Trend Micro.",
      "privacy": {
        "input": "Please enter your email address.",
        "terms": "Yes, Trend Micro can reach me at this address: ",
        "label": "If Trend Micro has a follow-up survey on the Email Scan, would you like to participate?"
      }
    }
  };
  describe("#reportFeedbacks successfully", function() {
    before("Insert one dummy survey record", function(done) {
      let event = {
        accountid: accountid,
        subject: subject,
        survey: surveyContent,
      };
      surveyjs.addOneSurvey(event, function(err, data) {
        if (err) throw err;
        surveyid = data.surveyid;
        let feedbackEvent = {
          surveyid: data.surveyid,
          clientid: "this is fake clientid",
          feedback: {
            "Q1": {
              "data": [
                {
                  "value": "1",
                  "label": "Radio option 1"
                }
              ],
              "label": "Radio question label",
              "type": "radio"
            },
            "Q2": {
              "data": [
                {
                  "value": "1",
                  "label": "Checkbox option 1"
                },
                {
                  "value": "1APPGUSH054A3SE6KSBAA",
                  "label": "Checkbox option 2"
                },
                {
                  "value": "1APPGV16961XPC85S6NNA",
                  "label": "Checkbox option 3"
                },
                {
                  "value": "1APPGV6DJ5TMJ3AAB4IXO",
                  "label": "Checkbox option 4"
                },
                {
                  "input": "Checkbox input",
                  "value": "1APPGVH3AKIG3DI5D63OY",
                  "label": "Checkbo option 5 with input"
                }
              ],
              "label": "Checkbox question label",
              "type": "checkbox"
            },
            "Q3": {
              "data": [
                {
                  "input": "Rating input",
                  "value": "1",
                  "label": "Scale 1"
                }
              ],
              "label": "Rating question label",
              "type": "rating"
            },
            "thankyou": {
              "privacy": {
                "input": "Thankyoupage@trend.com.tw"
              }
            }
          }
        };
        feedbackjs.addOneFeedback(feedbackEvent, function(err, response) {
          if (err) throw err;
          let feedbackEvent2 = {
            surveyid: data.surveyid,
            clientid: "this is fake clientid1",
            feedback: {
              "Q1": {
                "data": [
                  {
                    "value": "1",
                    "label": "Radio option 1"
                  }
                ],
                "label": "Radio question label",
                "type": "radio"
              },
              "Q2": {
                "data": [
                  {
                    "value": "1",
                    "label": "Checkbox option 1"
                  },
                  {
                    "value": "1APPGUSH054A3SE6KSBAA",
                    "label": "Checkbox option 2"
                  },
                  {
                    "value": "1APPGV16961XPC85S6NNA",
                    "label": "Checkbox option 3"
                  },
                  {
                    "value": "1APPGV6DJ5TMJ3AAB4IXO",
                    "label": "Checkbox option 4"
                  },
                  {
                    "input": "Checkbox input",
                    "value": "1APPGVH3AKIG3DI5D63OY",
                    "label": "Checkbo option 5 with input"
                  }
                ],
                "label": "Checkbox question label",
                "type": "checkbox"
              },
              "Q3": {
                "data": [
                  {
                    "input": "Rating input",
                    "value": "1",
                    "label": "Scale 1"
                  }
                ],
                "label": "Rating question label",
                "type": "rating"
              },
              "thankyou": {
                "privacy": {
                  "input": "Thankyoupage@trend.com.tw"
                }
              }
            }
          };
          feedbackjs.addOneFeedback(feedbackEvent2, function(err, response) {
            if (err) throw err;
            done();
          });
        });
      });
    });

    describe("When getting exist feedback CSV report with complete and normal parameters", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: surveyid,
          accountid: accountid
        };
        feedbackjs.reportFeedbacks(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'surveyid', 'subject', 'survey', 'l10n', 'data', 'datetime']);
          response.accountid.should.have.string(accountid);
          response.surveyid.should.have.string(surveyid);
          response.subject.should.have.string(subject);
          response.data.length.should.be.above(0);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });

    describe("When getting exist feedback CSV report when feedback data exceed 1MB.", function() {
      it("should response successfully", function(done) {
        let event = {
          surveyid: surveyid,
          accountid: accountid,
          unitTest: true,
        };
        feedbackjs.reportFeedbacks(event, function(error, response) {
          expect(error).to.be.null;
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'surveyid', 'subject', 'survey', 'l10n', 'data', 'datetime']);
          response.accountid.should.have.string(accountid);
          response.surveyid.should.have.string(surveyid);
          response.subject.should.have.string(subject);
          response.data.length.should.be.above(0);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#reportFeedbacks with error", function() {
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
      {
        desc: "with not match any event.surveyid",
        event: {
          accountid: "this is dummy accountid",
          surveyid: "Not match"
        },
        expect: /Error: 404 Not Found/
      },
      // missing parameter(s)
      {
        desc: "with missing event.surveyid",
        event: {
          accountid: "this is fake accountid"
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
      describe("When getting one feedback CSV report " + test.desc, function() {
        it("should response error", function(done) {
          feedbackjs.reportFeedbacks(test.event, function(error, response) {
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