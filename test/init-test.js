// require testing target and set up necessary information
let aws = require('aws-sdk');
let dynadblib = require('./dynadb');
let dynadb = new dynadblib();
let dynalitePort = 9527;

// create user table
aws.config.update({
  accessKeyId: "accessKeyId",
  secretAccessKey: "secretAccessKey",
  region: 'us-east-1',
  endpoint: 'http://localhost:' + dynalitePort
});
let userjs = require('../api/user/user.js')(aws);
let surveyjs = require('../api/survey/survey.js')(aws);
let feedbackjs = require('../api/feedback/feedback.js')(aws);

before('Initial local DynamoDB', function(done) {
  this.timeout(10000);
  // set up necessary information
  process.env['SERVERLESS_USERTABLE'] = 'usertable';
  process.env['SERVERLESS_SURVEYTABLE'] = 'surveytable';
  process.env['SERVERLESS_FEEDBACKTABLE'] = 'feedbacktable';

  // Returns a standard Node.js HTTP server
  dynadb.listen(dynalitePort, err => {
    if (err) throw err;

    let dynamodb = new aws.DynamoDB({
      apiVersion: '2012-08-10'
    });

    let params;

    let userTable = new Promise(resolve => {
      params = {
        TableName: process.env.SERVERLESS_USERTABLE,
        AttributeDefinitions: [{
          AttributeName: "accountid",
          AttributeType: "S"
        }],
        KeySchema: [{
          AttributeName: "accountid",
          KeyType: "HASH"
        }],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      };
      dynamodb.createTable(params, err => {
        if (err) throw err;
        resolve();
      });
    });

    let surveyTable = new Promise(resolve => {
      params = {
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
      dynamodb.createTable(params, err => {
        if (err) throw err;
        resolve();
      });
    });

    let feedbackTable = new Promise(resolve => {
      params = {
        TableName: process.env.SERVERLESS_FEEDBACKTABLE,
        AttributeDefinitions: [
          {
            AttributeName: "surveyid",
            AttributeType: "S"
          },
          {
            AttributeName: "clientid",
            AttributeType: "S"
          }
        ],
        KeySchema: [
          {
            AttributeName: "surveyid",
            KeyType: "HASH"
          },
          {
            AttributeName: "clientid",
            KeyType: "RANGE"
          }
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5
        }
      };
      dynamodb.createTable(params, err => {
        if (err) throw err;
        resolve();
      });
    });

    Promise.all([userTable, surveyTable, feedbackTable]).then(() => {
      done();
    });

  });
});

after('Uninitial local DynamoDB', done => {
  dynadb.close(done);
});

module.exports = {
  feedbackjs,
  surveyjs,
  userjs,
};