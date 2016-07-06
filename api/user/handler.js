'use strict';

let aws = require('../config/aws');
let user = require('./user');


module.exports.handler = function(event, context, callback) {
  // request from API Gateway
  console.log("Dispatch request from API Gateway: ", JSON.stringify(event));
  user.initAWS(aws);

  switch(event.op) {
    case "listUsers":
      // GET /api/v1/mgnt/users/[?startKey=<startKey>]
      // Authenticated: Yes, params: authAccountid
      // TODO: invoke listUsers once authentication is implemented and enabled
      return user.listUsers({
        startKey : event.startKey,
      }, callback);
      break;
    case "updateOneUser":
      // PUT /api/v1/mgnt/users/
      // Authenticated: Yes, params: authAccountid
      // TODO: invoke updateOneUser once authentication is implemented and enabled
      return user.updateOneUser({
        accountid: event.accountid,
        username: event.username,
        email: event.email,
        role: event.role
      }, callback);
      break;
    case "deleteOneUser":
      // DELETE /api/v1/mgnt/users/<accountid>
      // Authenticated: Yes, params: authAccountid
      // TODO: invoke deleteOneUser once authentication is implemented and enabled
      return user.deleteOneUser({
        "accountid": event.accountid
      }, callback);
      break;
    default:
      let error = new Error("400 Bad Request: " + JSON.stringify(event));
      return callback(error, null);
  }

};