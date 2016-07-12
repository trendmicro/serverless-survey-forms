'use strict';

let aws = require('../config/aws');
let survey = require('./survey');
survey.initAWS(aws);
module.exports.handler = (event, context, callback) => {
  // request from API Gateway
  console.log("Dispatch request from API Gateway: ", JSON.stringify(event));

  switch(event.op) {
    case "getOneSurvey":
      // GET /api/v1/surveys/<accountid>/<surveyid>/
      // Authenticated: Not necessary
      return survey.getOneSurvey({
        accountid: event.accountid,
        surveyid: event.surveyid
      }, callback);
      break;

    case "listSurveys":
      // GET /api/v1/mgnt/surveys/[?startKey=<startKey>]
      // Authenticated: Yes
      // TODO: validate requester role Check if authAccountid is authorized to create a new survey
      //        authAccountid: event.authAccountid,
      return survey.listSurveys({
        accountid: event.accountid,
        startKey: event.startKey,
      }, callback);
      break;

    case "addOneSurvey":
      // POST /api/v1/mgnt/surveys/
      // Authenticated: Yes
      // TODO: validate requester role Check if authAccountid is authorized to create a new survey
      //        authAccountid: event.authAccountid,
      return survey.addOneSurvey({
        accountid: event.authAccountid,
        subject: event.subject,
        survey: event.survey
      }, callback);
      break;

    case "updateOneSurvey":
      // PUT /api/v1/mgnt/surveys/
      // Authenticated: Yes
      // TODO: validate requester role Check if authAccountid is authorized to create a new survey
      //        authAccountid: event.authAccountid,
      return survey.updateOneSurvey({
        accountid: event.accountid,
        subject: event.subject,
        survey: event.survey,
        surveyid: event.surveyid
      }, callback);
      break;

    case "deleteOneSurvey":
      // DELETE /api/v1/mgnt/surveys/<surveyid>
      // TODO: validate requester role Check if authAccountid is authorized to create a new survey
      // Authenticated: Yes
      return survey.deleteOneSurvey({
        accountid: event.accountid,
        surveyid: event.surveyid
      }, callback);
      break;

    default:
      let error = new Error("400 Bad Request: " + JSON.stringify(event));
      return callback(error, null);
  }
};