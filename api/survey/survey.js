'use strict';

let docClient;

module.exports = ((aws) => {
  if (!docClient && aws) {
    docClient = new aws.DynamoDB.DocumentClient();
  }

  const getUUID = () => {
    let uuid = require('node-uuid');
    return uuid.v1();
  };


  // Convert DynamoDB error code into Error object
  const getDynamoDBError = (err) => {
    if (err.statusCode === 400) {
      switch (err.code) {
        case "AccessDeniedException":
        case "UnrecognizedClientException":
          return new Error("401 Unauthorized: Unable to access an item with error: " + JSON.stringify(err));
          break;
        default:
          return new Error("400 Bad Request: Unable to access an item with error: " + JSON.stringify(err));
      }
    } else { // 500, 503
      return new Error("500 Internal Server Error: Unable to access an item with error: " + JSON.stringify(err));
    }
  };

  /*
   * Parameters:
   * Key        Description
   * accountid  Who created the survey
   * surveyid   The uuid of the survey
   *
   * Response:
   * Key        Description
   * accountid  Who created the survey
   * surveyid   The uuid of the survey
   * subject    The subject of the survey
   * datetime   The latest modified date time of the survey
   * survey     The details of the survey model in JSON format
   * l10n       The details of the survey l10n mapping table in JSON format
   */
  const getOneSurvey = (event, callback) =>{
    let response = null;

    // validate parameters
    if (event.accountid && event.surveyid &&
      process.env.SERVERLESS_SURVEYTABLE) {
      let params = {
        TableName: process.env.SERVERLESS_SURVEYTABLE,
        Key: {
          accountid: event.accountid,
          surveyid: event.surveyid
        }
      };

      docClient.get(params, function(err, data) {
        if (err) {
          console.error("Unable to get an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
          return callback(getDynamoDBError(err), null);
        } else {
          if (data.Item) { // got response
            // compose response
            response = {
              accountid: data.Item.accountid,
              surveyid: data.Item.surveyid,
              subject: data.Item.subject,
              datetime: data.Item.datetime,
              survey: data.Item.survey,
              l10n: data.Item.l10n
            };
            return callback(null, response);
          } else {
            console.error("Unable to get an item with the request: ", JSON.stringify(params));
            return callback(new Error("404 Not Found: Unable to get an item with the request: " + JSON.stringify(params)), null);
          }
        }
      });
    }
    // incomplete parameters
    else {
      return callback(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)), null);
    }
  };


  /*
   * Parameters:
   * Key        Description
   * startKey   If your query amount to more than 1 MB of data, you'll need to perform another query request for the next 1 MB of data.
   *            To do this, take the lastEvaluatedKey value from the previous request, and use that value as the startKey in the next request.
   *            This approach will let you progressively query for new data in 1 MB increments.
   *
   * Response:
   * Key        Description
   * surveys    An array of surveys objects (see below)
   *
   * Each object in the user array contains:
   * accountid  Who created the survey
   * surveyid   The uuid of the survey
   * subject    The subject of the survey
   * count      The count of total feedbacks numbers
   * datetime   The latest modified date time of the survey
   */
  const listSurveys = (event, callback) => {
    let response = null;
    // validate parameters
    if (event.accountid && process.env.SERVERLESS_SURVEYTABLE) {
      let params = {
        TableName: process.env.SERVERLESS_SURVEYTABLE,
        ProjectionExpression: "accountid, #dt, subject, surveyid",
        KeyConditionExpression: "accountid = :accountId",
        ExpressionAttributeNames: {
          "#dt": "datetime",
        },
        ExpressionAttributeValues: {
          ":accountId": event.accountid,
        },
      };
      // continue querying if we have more data
      if (event.startKey){
        params.ExclusiveStartKey = event.startKey;
      }
      // turn on the limit in testing mode
      if (event.unitTest){
        params.Limit = 1;
      }

      const listObjectPromise = docClient.query(params).promise();

      const queryCountFeedbacks = ((response) => {
        let feedback = require('../feedback/feedback.js')();
        let surveyDatas = response['surveys'];
        return Promise.all(
          surveyDatas.map( (surveyData) => {
            return new Promise((resolve, reject) => {
              feedback.countFeedbacks({
                surveyid :  surveyData.surveyid
              }, (err, countResponse) => {
                if (err) {
                  reject(err);
                } else {
                  surveyData['count'] = countResponse['Count'];
                  resolve(surveyData);
                }
              });
            });
          })
        )
      });

      listObjectPromise.then((data) => {
        response = {};
        response['surveys'] = data.Items;
        // LastEvaluatedKey
        if(typeof data.LastEvaluatedKey != "undefined") {
          response['LastEvaluatedKey'] = data.LastEvaluatedKey;
        }
        return response;
      }).then(queryCountFeedbacks).then(() => {
        return callback(null, response);
      }).catch((err) => {
        console.error("Error: ", err);
        callback(getDynamoDBError(err), null);
      });
    }
    else {
      return callback(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)), null);
    }
  };

  /*
   * Parameters:
   * Key          Description
   * accountid    Who created the survey
   * subject      The subject of the survey
   * survey       The details of the survey model in JSON format
   *
   * Response:
   * Key          Description
   * accountid    Who created the survey
   * surveyid     The uuid of the survey
   * datetime     The creation date time of the survey
   */
  const addOneSurvey = (event, callback) => {
    let response = null;

    // validate parameters
    if (event.accountid && event.subject && event.survey &&
      process.env.SERVERLESS_SURVEYTABLE) {
      let surveyid = getUUID();
      let datetime = Date.now();
      let params = {
        TableName: process.env.SERVERLESS_SURVEYTABLE,
        Item: {
          accountid: event.accountid,
          surveyid: surveyid,
          subject: event.subject,
          datetime: datetime,
          survey: event.survey
        }
      };
      if (event.l10n) {
        params.Item.l10n = event.l10n;
      }
      docClient.put(params, function(err, data) {
        if (err) {
          console.error("Unable to add a new item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
          return callback(getDynamoDBError(err), null);
        } else {
          // compose response
          response = {
            accountid: event.accountid,
            datetime: datetime,
            surveyid: surveyid
          };
          return callback(null, response);
        }
      });
    }
    // incomplete parameters
    else {
      return callback(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)), null);
    }
  };

  /*
   * Parameters:
   * Key          Description
   * accountid    Who created the survey
   * surveyid     The uuid of the survey
   * subject      The subject of the survey
   * survey       The details of the survey model in JSON format
   *
   * Response:
   * Key          Description
   * accountid    Who created the survey
   * surveyid     The uuid of the survey
   * datetime     The creation date time of the survey
   */
  const updateOneSurvey = (event, callback) => {
    let response = null;
    // validate parameters
    if (event.accountid  && event.surveyid &&
      (event.subject || event.survey || event.l10n) &&
      process.env.SERVERLESS_SURVEYTABLE) {
      let datetime = Date.now();
      let params = {
        TableName: process.env.SERVERLESS_SURVEYTABLE,
        Key:{
          accountid: event.accountid,
          surveyid: event.surveyid
        },
        UpdateExpression: "set #dt=:datetime",
        ExpressionAttributeValues:{
          ":datetime": datetime
        },
        ExpressionAttributeNames: {
          "#dt": "datetime",
        },
        "ConditionExpression": "(attribute_exists(surveyid)) AND (attribute_exists(accountid)) ",
        ReturnValues:"UPDATED_NEW"
      };

      let updateArray = [];
      if (event.subject) updateArray.push("subject");
      if (event.survey) updateArray.push("survey");
      if (event.l10n) updateArray.push("l10n");

      if (updateArray.length) {
        params.UpdateExpression = params.UpdateExpression + "," + updateArray.map(column => {
          params.ExpressionAttributeValues[":" + column] = event[column];
          return column + "=:" + column;
        }).join(",");

        docClient.update(params, function(err, data) {
          if (err) {
            if(err.code === "ConditionalCheckFailedException"){
              console.error("Unable to update an item with the request: ", JSON.stringify(params));
              return callback(new Error("404 Not Found: Unable to update an not exist item with the request: " + JSON.stringify(params)), null);
            }else{
              console.error("Unable to update an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
              return callback(getDynamoDBError(err), null);
            }
          } else {
            // compose response
            response = {
              datetime: data.Attributes.datetime,
            };
            return callback(null, response);
          }
        });
      } else {
        return callback(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)), null);
      }
    } else { // incomplete parameters
      return callback(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)), null);
    }
  };


  /*
   * Parameters:
   * Key          Description
   * accountid    Who created the survey
   * surveyid     The uuid of the survey
   *
   * Response:
   * None
   */
  const deleteOneSurvey = event => {
    return new Promise((resolve, reject) => {
      // validate parameters
      if (event.accountid && event.surveyid && process.env.SERVERLESS_SURVEYTABLE) {
        let feedback = require('../feedback/feedback.js')(),
            params = {
              RequestItems: {
                [process.env.SERVERLESS_SURVEYTABLE]: [{
                  DeleteRequest: {
                    Key: {
                      accountid: event.accountid,
                      surveyid: event.surveyid,
                    },
                  },
                }],
              },
            };
        // Invoke deleteFeedbacks and pass the parameter of deleteOneSurvey, to excute batchWrite().
        feedback.deleteFeedbacks(event, params).then(() => {
          resolve({}); // Response will be HTTP 200.
        }).catch(err => {
          reject(err);
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  return {
    getOneSurvey : getOneSurvey,
    listSurveys: listSurveys,

    addOneSurvey : addOneSurvey,
    updateOneSurvey : updateOneSurvey,
    deleteOneSurvey : deleteOneSurvey,
  }
});
