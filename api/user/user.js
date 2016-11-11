'use strict';

let docClient;

module.exports = ((aws) => {
  if (!docClient && aws) {
    docClient = new aws.DynamoDB.DocumentClient();
  }

  // Convert DynamoDB error code into Error object
  const getDynamoDBError = err => {
    if (err.statusCode === 400) {
      switch (err.code) {
        case "AccessDeniedException":
        case "UnrecognizedClientException":
          return new Error("401 Unauthorized: Unable to access an item with error: " + JSON.stringify(err));
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
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   *
   * Response:
   * Key        Description
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   * username   User name from authentication provider or "admin" for ${project}-${stage}-admin
   * email      Email from authentication provider or sha2 of password for ${project}-${stage}-admin
   * role       Default role is "User" when a user grants permission to the system.
   */
  const getOneUser = event => {
    let response = null;
    return new Promise((resolve, reject) => {
      // validate parameters
      if (event.accountid && process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          Key: {
            accountid: event.accountid,
          },
        };

        docClient.get(params, (err, data) => {
          if (err) {
            console.error("Unable to get an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
            reject(getDynamoDBError(err));
          } else {
            if (data.Item) { // got response
              // compose response
              response = {
                accountid: data.Item.accountid,
                username: data.Item.username,
                role: data.Item.role,
              };
              resolve(response);
            } else {
              console.error("Unable to get an item with the request: ", JSON.stringify(params));
              reject(new Error("404 Not Found: Unable to get an item with the request: " + JSON.stringify(params)));
            }
          }
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  /**
   * Parameters:
   * Key        Description
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   *
   * Response:
   * Key        Description
   * Count — the number of items that were returned in the response.
   */
  const countUser = event => {
    let response = {};
    return new Promise((resolve, reject) => {
      // validate parameters
      if (process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          Select: "COUNT",
        };

        docClient.scan(params, (err, data) => {
          if (err) {
            console.error("Unable to get an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
            reject(getDynamoDBError(err));
          } else {
            response = data;
            resolve(response);
          }
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
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
   * users      An array of users objects (see below)
   *
   * Each object in the user array contains:
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   * username   User name from authentication provider or "admin" for ${project}-${stage}-admin
   * email      Email from authentication provider or sha2 of password for ${project}-${stage}-admin
   * role       Default role is "User" when a user grants permission to the system.
   */
  const listUsers = event => {
    let response = null;
    return new Promise((resolve, reject) => {
      // validate parameters
      if (process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          ProjectionExpression: "accountid, username, email, #role",
          ExpressionAttributeNames: {
            "#role": "role",
          },
        };

        // continue querying if we have more data
        if (event.startKey) {
          params.ExclusiveStartKey = event.startKey;
        }
        // turn on the limit in testing mode
        if (event.limitTesting) {
          params.Limit = 1;
        }

        docClient.scan(params, (err, data) => {
          if (err) {
            console.error("Unable to get an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
            reject(getDynamoDBError(err));
          } else {
            // got response
            // compose response
            response = {
              users: data.Items,
            };

            // LastEvaluatedKey
            if (typeof data.LastEvaluatedKey != "undefined") {
              response.LastEvaluatedKey = data.LastEvaluatedKey;
            }
            resolve(response);
          }
        });
      } else {
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  /*
   * Parameters:
   * Key        Description
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   * username   User name from authentication provider or "admin" for ${project}-${stage}-admin
   * email      Email from authentication provider or sha2 of password for ${project}-${stage}-admin
   *
   * Response:
   * None
   */
  const addOneUser = event => {
    return new Promise((resolve, reject) => {
      // validate parameters
      if (event.accountid && event.username && event.email && event.role && process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          Item: {
            accountid: event.accountid,
            username: event.username,
            email: event.email,
            role: event.role,
          },
        };

        docClient.put(params, err => {
          if (err) {
            console.error("Unable to add a new user with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
            reject(getDynamoDBError(err));
          } else {
            resolve({});
          }
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  /*
   * Parameters:
   * Key        Description
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   * username   User name from authentication provider or "admin" for ${project}-${stage}-admin
   * email      Email from authentication provider or sha2 of password for ${project}-${stage}-admin
   * role       Role
   * Response:
   * None
   */
  const updateOneUser = event => {
    return new Promise((resolve, reject) => {
      // validate parameters
      if (event.accountid && process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          Key: {
            accountid: event.accountid,
          },
          UpdateExpression: "set username = :username, email=:email, #role=:role",
          ExpressionAttributeValues: {
            ":username": event.username,
            ":email": event.email,
            ":role": event.role,
          },
          ExpressionAttributeNames: {
            "#role": "role",
          },
          ConditionExpression: "attribute_exists(accountid)",
          ReturnValues: "UPDATED_NEW",
        };

        docClient.update(params, err => {
          if (err) {
            if(err.code === "ConditionalCheckFailedException"){
              console.error("Unable to update an user with the request: ", JSON.stringify(params));
              reject(new Error("404 Not Found: Unable to update an not exist item with the request: " + JSON.stringify(params)));
            }else{
              console.error("Unable to update an user with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
              reject(getDynamoDBError(err));
            }
          } else {
            // got response
            resolve({});
          }
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  /*
   * Parameters:
   * Key        Description
   * accountid  accountid with authentication provider as prefix or default system ${project}-${stage}-admin
   *
   * Response:
   * None
   */
  const deleteOneUser = event => {
    return new Promise((resolve, reject) => {
      // validate parameters
      if (event.accountid && process.env.SERVERLESS_USERTABLE) {
        let params = {
          TableName: process.env.SERVERLESS_USERTABLE,
          Key: {
            accountid: event.accountid,
          },
        };
        docClient.delete(params, err => {
          if (err) {
            console.error("Unable to delete an item with the request: ", JSON.stringify(params), " along with error: ", JSON.stringify(err));
            reject(getDynamoDBError(err));
          } else {
            resolve({}); // Response will be an HTTP 200 with no content.
          }
        });
      } else { // incomplete parameters
        reject(new Error("400 Bad Request: Missing parameters: " + JSON.stringify(event)));
      }
    });
  };

  return {
    getOneUser,
    countUser,
    listUsers,
    addOneUser,
    updateOneUser,
    deleteOneUser,
  };
});