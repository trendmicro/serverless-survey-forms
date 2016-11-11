'use strict';

let expect = require('chai').expect;
let should = require('chai').should();
let init = require('./init-test'),
    surveyjs = init.surveyjs,
    feedbackjs = init.feedbackjs;

describe("Interface to add one new survey model into data store", () => {
  describe("#addOneSurvey successfully", () => {
    describe("When adding one new survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: "this is fake account",
          subject: "this is fake subject",
          survey: "this is fake survey model",
          l10n: "This is survey l10n mapping",
        };
        surveyjs.addOneSurvey(event).then(response => {
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
  describe("#addOneSurvey with error", () => {
    let missingParams = [
      {
        desc: "with missing event.survey",
        event: {
          accountid: "this is fake account",
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.subject",
        event: {
          accountid: "this is fake account",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          subject: "this is fake subject",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.subject and event.survey",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.survey",
        event: {
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.subject",
        event: {
          survey: "this is fake survey model"
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
          subject: "this is fake subject",
          survey: "this is fake survey model",
        },
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When adding one new survey model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_SURVEYTABLE = "XXX";
          surveyjs.addOneSurvey(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_SURVEYTABLE surveytable", done => {
      process.env.SERVERLESS_SURVEYTABLE = 'surveytable';
      done();
    });
  });
});

describe("Interface to get one survey model from data store", () => {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let l10nmodel = "this is fake l10n model";
  let surveyid = null;

  before("Insert one dummy record", done => {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel,
      l10n: l10nmodel,
    };
    surveyjs.addOneSurvey(event).then(data => {
      surveyid = data.surveyid;
      done();
    }).catch(err => {
      throw err;
    });
  });

  describe("#getOneSurvey successfully", () => {
    describe("When getting exist survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: accountid,
          surveyid: surveyid,
        };
        surveyjs.getOneSurvey(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.all.keys(['accountid', 'surveyid', 'subject', 'datetime', 'survey', 'l10n']);
          response.accountid.should.have.string(accountid);
          response.surveyid.should.have.string(surveyid);
          response.subject.should.have.string(subject);
          response.survey.should.have.string(surveymodel);
          response.l10n.should.have.string(l10nmodel);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#getOneSurvey with error", () => {
    let missingParams = [
      {
        desc: "with not match any event.accountid",
        event: {
          accountid: "Not match",
          surveyid: "this is fake survey id"
        },
        expect: /Error: 404 Not Found/
      },
      {
        desc: "with missing event.surveyid",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          surveyid: "this is fake survey id"
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
          accountid: "Not match",
          surveyid: "this is fake survey id"
        },
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When getting one survey model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_SURVEYTABLE = "XXX";
          surveyjs.getOneSurvey(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_SURVEYTABLE surveytable", done => {
      process.env.SERVERLESS_SURVEYTABLE = 'surveytable';
      done();
    });
  });
});

describe("Interface to get list survey model from data store", () => {
  let accountid = "this is fake account";

  describe("#listSurveys successfully", () => {
    describe("When getting exist survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: accountid,
        };
        surveyjs.listSurveys(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.keys('surveys');
          response.surveys.length.should.equal(2); // There are two survey model in above test case.
          response.surveys.map(obj => {
            obj.should.have.keys(['accountid', 'surveyid', 'subject', 'count', 'datetime']);
            obj.accountid.should.exist;
            obj.surveyid.should.exist;
            obj.subject.should.exist;
            obj.count.should.exist;
            obj.datetime.should.exist;
          });
          done();
        });
      });
    });
    describe("When getting exist survey model with startKey parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: accountid,
          unitTest: true
        };
        const limitTestCase = event => {
          surveyjs.listSurveys(event).then(response => {
            if (typeof response.LastEvaluatedKey !== "undefined") {
              expect(response).to.not.be.null;
              response.should.have.keys(['surveys', 'LastEvaluatedKey']);
              response.surveys.length.should.equal(1); // There is one survey model because setting limit is 1.
              response.surveys.map(obj => {
                obj.should.have.keys(['accountid', 'surveyid', 'subject', 'count', 'datetime']);
                obj.surveyid.should.exist;
                obj.accountid.should.exist;
                obj.subject.should.exist;
                obj.count.should.exist;
                obj.datetime.should.exist;
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
  describe("#listSurveys with error", () => {
    let missingParams = [
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with wrong table",
        event: {accountid: accountid},
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When getting list survey model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_SURVEYTABLE = "XXX";
          surveyjs.listSurveys(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_SURVEYTABLE surveytable", done => {
      process.env.SERVERLESS_SURVEYTABLE = 'surveytable';
      done();
    });
  });
});

describe("Interface to update one survey model in data store", () => {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let l10nmodel = "this is fake l10n model";
  let surveyid = null;

  before("Insert one dummy record", done => {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel,
      l10n: l10nmodel,
    };
    surveyjs.addOneSurvey(event).then(data => {
      surveyid = data.surveyid;
      done();
    }).catch(err => {
      throw err;
    });
  });

  describe("#updateOneSurvey successfully", () => {
    describe("When updating one exist survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: "this is fake account",
          subject: "this is a modified subject",
          survey: "this is modified fake survey model",
          l10n: "this is modified fake l10n model",
          surveyid: surveyid,
        };
        surveyjs.updateOneSurvey(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.all.keys(['datetime']);
          response.datetime.should.be.above(0);
          done();
        });
      });
    });
  });
  describe("#updateOneSurvey with error", () => {
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
      {
        desc: "with missing event.survey",
        event: {
          accountid: "this is fake account",
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.subject",
        event: {
          accountid: "this is fake account",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          subject: "this is fake subject",
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.subject and event.survey",
        event: {
          accountid: "this is fake account"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.survey",
        event: {
          subject: "this is fake subject"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid and event.subject",
        event: {
          survey: "this is fake survey model"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing all parameters",
        event: {},
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing one of update values",
        event: {
          accountid: "this is fake account",
          surveyid: "this is fake surveyid"
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with wrong table",
        event: {
          accountid: "not found",
          subject: "this is a modified subject",
          survey: "this is modified fake survey model",
          surveyid: "not found",
          l10n: "not found",
        },
        expect: /Error: 400 Bad Request/
      }
    ];
    errorParams.forEach(test => {
      describe("When updating one survey model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_SURVEYTABLE = "XXX";
          surveyjs.updateOneSurvey(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_SURVEYTABLE surveytable", done => {
      process.env.SERVERLESS_SURVEYTABLE = 'surveytable';
      done();
    });
  });
});

describe("Interface to delete one survey model from data store", () => {
  let accountid = "this is fake account";
  let subject = "this is fake subject";
  let surveymodel = "this is fake survey model";
  let surveyid = null;

  before("Insert one dummy record && 30 dummy feebacks", done => {
    let event = {
      accountid: accountid,
      subject: subject,
      survey: surveymodel,
    };
    surveyjs.addOneSurvey(event).then(data => {
      surveyid = data.surveyid;

      // Add 30 dummy feebacks
      let success = 0;
      for (let i = 0; i < 30; i++) {
        let event = {
          surveyid: data.surveyid,
          clientid: "this is fake clientid" + i,
          feedback: "this is fake feedback model",
        };
        feedbackjs.addOneFeedback(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.all.keys('datetime');
          response.datetime.should.be.above(0);
          success += 1;
          if (success === 30) done();
        });
      }
    }).catch(err => {
      throw err;
    });
  });

  describe("#deleteOneSurvey successfully", () => {
    describe("When deleting exist survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: accountid,
          surveyid: surveyid,
        };
        feedbackjs.listFeedbacks(event).then(response => {
          expect(response).to.not.be.null;
          response.should.have.keys('feedbacks');
          response.feedbacks.length.should.equal(30); // There are 30 feedbacks model in above test case.
          return surveyjs.deleteOneSurvey(event);
        }).then(response => {
          expect(response).to.not.be.null;
          return feedbackjs.listFeedbacks(event);
        }).then(response => {
          expect(response).to.not.be.null;
          response.should.have.keys('feedbacks');
          response.feedbacks.length.should.equal(0); // There are 0 feedbacks model in above test case.
          done();
        });
      });
    });
    describe("When deleting non-exist survey model with complete and normal parameters", () => {
      it("should response successfully", done => {
        let event = {
          accountid: 'non-exist accountid',
          surveyid: 'non-exist surveyid',
        };
        surveyjs.deleteOneSurvey(event).then(response => {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
    describe("When deleting exist survey model without any feedback record", () => {
      before("Insert one dummy record", done => {
        let event = {
          accountid: accountid,
          subject: subject,
          survey: surveymodel,
        };
        surveyjs.addOneSurvey(event).then(data => {
          done();
        }).catch(err => {
          throw err;
        });
      });
      it("should response successfully", done => {
        let event = {
          accountid: accountid,
          surveyid: surveyid,
        };
        surveyjs.deleteOneSurvey(event).then(response => {
          expect(response).to.not.be.null;
          done();
        });
      });
    });
  });

  describe("#deleteOneSurvey with error", () => {
    let missingParams = [
      {
        desc: "with missing event.surveyid",
        event: {
          accountid: "this is fake account",
        },
        expect: /Error: 400 Bad Request/
      },
      {
        desc: "with missing event.accountid",
        event: {
          surveyid: "this is fake survey model"
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
          surveyid: "this is fake survey model",
        },
        expect: /Error: 400 Bad Request/
      }
    ];

    missingParams.forEach(test => {
      describe("When deleting one survey model " + test.desc, () => {
        it("should response error", done => {
          if (test.desc === "with wrong table") process.env.SERVERLESS_SURVEYTABLE = "XXX";
          surveyjs.deleteOneSurvey(test.event).catch(error => {
            expect(error).to.not.be.null;
            error.should.match(RegExp(test.expect));
            done();
          });
        });
      });
    });

    after("Set SERVERLESS_SURVEYTABLE surveytable", done => {
      process.env.SERVERLESS_SURVEYTABLE = 'surveytable';
      done();
    });
  });
});