'use strict';

let aws = require('../config/aws');
let feedback = require('./feedback')(aws);
let user = require('../user/user.js')(aws);

module.exports.handler = (event, context, callback) => {
  // request from API Gateway
  console.log("Dispatch request from API Gateway: ", JSON.stringify(event));

  // validate requester role Check if authAccountid is authorized
  const authorizedJudge = new Promise((resolve, reject) => {
    if (!event.authAccountid) {
      reject(new Error("400 Bad Request: " + JSON.stringify(event)));
    } else {
      user.getOneUser({
        accountid: event.authAccountid,
      }).then(data => {
          // Authorized: Designer or Admin
          if (data.role === "Admin" || data.role === "Designer") {
          resolve();
        } else {
          reject(new Error(`403 Unauthorized request: The role of the requester ${event.authAccountid} is ${data.role}`));
        }
      }).catch(err => {
        reject(err);
      });
    }
  });

  switch (event.op) {
    case "getOneFeedback":
      // GET /api/v1/feedbacks/<surveyid>/<clientid>/
      feedback.listFeedbacks({
        surveyid: event.surveyid,
        clientid: event.clientid,
      }).then(response => {
        if (event.ifModifiedSince && response.datetime && new Date(response.datetime).toUTCString() === event.ifModifiedSince) {
          return callback("304 Not Modified", null);
        } else {
          response.datetime = new Date(response.datetime).toUTCString();
          return callback(null, response);
        }
      }).catch(err => {
        return callback(err, null);
      });
      break;

    case "listFeedbacks":
      // GET /api/v1/mgnt/feedbacks/<surveyid>[?startKey=<startKey>]
      // Authenticated: Yes
      authorizedJudge.then(() => {
        return feedback.listFeedbacks({
          surveyid: event.surveyid,
          clientid: event.clientid,
        });
      }).then(response => {
        return callback(null, response);
      }).catch(err => {
        return callback(err, null);
      });
      break;

    case "addOneFeedback":
      // POST /api/v1/feedbacks/<surveyid>/<clientid>
      feedback.addOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid,
        feedback: event.feedback,
      }).then(response => {
        return callback(null, response);
      }).catch(err => {
        return callback(err, null);
      });
      break;

    case "updateOneFeedback":
      // PUT /api/v1/feedbacks/<surveyid>/<clientid>
      feedback.updateOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid,
        feedback: event.feedback,
      }).then(response => {
        return callback(null, response);
      }).catch(err => {
        return callback(err, null);
      });
      break;

    case "deleteFeedbacks":
      // DELETE /api/v1/mgnt/feedbacks/<surveyid>/<clientid>
      // DELETE /api/v1/mgnt/feedbacks/<surveyid>
      // Authenticated: Yes
      authorizedJudge.then(() => {
        return feedback.deleteFeedbacks({
          surveyid: event.surveyid,
          clientid: event.clientid,
        });
      }).then(response => {
        return callback(null, response);
      }).catch(err => {
        return callback(err, null);
      });
      break;

    default:
      let error = new Error("400 Bad Request: " + JSON.stringify(event));
      return callback(error, null);
  }
};