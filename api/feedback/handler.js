'use strict';
let aws = require('../config/aws');
let feedback = require('./feedback');
feedback.initAWS(aws);
module.exports.handler = function(event, context, callback) {
  // request from API Gateway
  console.log("Dispatch request from API Gateway: ", JSON.stringify(event));

  switch (event.op){
    case "getOneFeedback":
      // GET /api/v1/feedbacks/<surveyid>/<clientid>/
      return feedback.getOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid,
      },callback);
      break;
    case "listFeedbacks":
      // GET /api/v1/mgnt/feedbacks/<surveyid>[?startKey=<startKey>]
      // Authenticated: Yes, params: authAccountid
      // TODO: invoke addOneFeedback once authentication is implemented and enabled
      return feedback.listFeedbacks({
        surveyid: event.surveyid,
        startKey: event.startKey
      }, callback);
      break;
    case "addOneFeedback":
      // POST /api/v1/feedbacks/<surveyid>/<clientid>
      return feedback.addOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid,
        feedback: event.feedback
      }, callback);
      break;
    case "updateOneFeedback":
      // PUT /api/v1/feedbacks/<surveyid>/<clientid>
      return feedback.updateOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid,
        feedback: event.feedback
      }, callback);
      break;
    case "deleteOneFeedback":
      // DELETE /api/v1/feedbacks/<surveyid>/<clientid>/
      return feedback.deleteOneFeedback({
        surveyid : event.surveyid,
        clientid : event.clientid
      }, callback);
      break;
    default:
      let error = new Error("400 Bad Request: " + JSON.stringify(event));
      return callback(error, null);
  }
};
