# serverless-survey-forms (still under construction)

[![Serverless Framework](https://camo.githubusercontent.com/547c6da94c16fedb1aa60c9efda858282e22834f/687474703a2f2f7075626c69632e7365727665726c6573732e636f6d2f6261646765732f76332e737667)](http://www.serverless.com/)
[![Build Status](https://travis-ci.org/trendmicro/serverless-survey-forms.svg?branch=master)](https://travis-ci.org/trendmicro/serverless-survey-forms)
[![Coverage Status](https://coveralls.io/repos/github/trendmicro/serverless-survey-forms/badge.svg?branch=master)](https://coveralls.io/github/trendmicro/serverless-survey-forms?branch=master)

To create a google-style survey forms, authorized users could design surveys and collect anonymous feedbacks.

## Architecture Overview

![](http://i.imgur.com/gBDCCON.png)

## Environment

This project depends on the following modules, please make sure they're ready locally.

* NodeJS 3.7.3
* serverless 0.5.5
* aws-sdk 2.3.7
* node-uuid 1.4.7
* chai 3.5.0
* dynalite 1.0.0
* mocha 2.4.5
* istanbul 0.4.3
* serverless-authentication 0.2.2
* serverless-authentication-facebook 0.2.0
* serverless-cors-plugin 0.4.1
* serverless-client-s3 2.0.0

The Vagrant file could save your time to prepare environemnt if you would like to leverage. 

## Installation

The steps below can be taken to install the project and initialize it.

Open a command line terminal and cd to the location where you will be placing the serverless-survey-forms project.

Clone the project directly from Github:

```git clone https://github.com/trendmicro/serverless-survey-forms.git```

Enter the serverless-survey-form folder that was just created:

```cd serverless-survey-form```

Initialize the project:

```serverless project init```

Install npm dependency modules in serverless-survey-form and serverless-survey-form/api

```
npm install
cd api
npm install
```

## CloudFront DomainName

After project initialization, the CloudFormation also create a new CloudFront distribution with two origins, the one is S3 bucket for static website resources, and the another one is API Gateway endpoint.

Please login to ```AWS console``` and get this CloudFront domain name from CloudFormation Output ```WebsiteDomainName``` or ```CloudFront Distributions```. The format should looks ```https://d230j9e0u5dil1.cloudfront.net```, for example.

## Authentication Provider Settings

### Facebook App Id Application

Firstly, you have to apply a Facebook App Id for OAuth athentication, please follow steps in [facebook for developer](https://developers.facebook.com/docs/apps/register) to create a **Website** app. 

Please leave **Valid OAuth redirect URIs** blank or invalid during thr process, since we can get back to this after deployment.

Open _meta/variables/s-variables-STAGE.json where STAGE is the stage you are using e.g. s-variables-dev.json in "dev" stage.

If you are using stage "dev", then contents of the s-variables-dev.json should be

```
{
  "stage": "dev",
  "redirectClientURI": "http://url-to-frontend-webapp/",
  "tokenSecret": "secret-for-json-web-token",
  "providerFacebookId": "facebook-app-id",
  "providerFacebookSecret": "facebook-app-secret"
}
```

Environmental variables are mapped in s-function.json files, for example in the signin/s-function.json.

## Static Website Resources Settings

Please revise ```client/dist/auth/app.js``` with your CloudFront domain name.

```
var endpoint = 'https://d230j9e0u5dil1.cloudfront.net/';
```

## Deployment

Deploy your functions, endpoints, and web client:

```
# deploy APIGW and Lambda
serverless dash deploy
# enable CORS
serverless endpoint deploy -a
# deploy static web resources
serverless client deploy -s STAGE
```

## Unit Test

The steps below can be taken to verify the functionality.

Enter the serverless-survey-form folder the project was cloned:

```cd serverless-survey-form```

Install npm dependency modules in serverless-survey-form

```npm install```

Verify the functionality before any code commit to Git.

```npm test```

## References

* [Serverless Authentication](https://github.com/laardee/serverless-authentication-boilerplate)
* [Introducing custom authorizers in Amazon API Gateway](https://aws.amazon.com/tw/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/)
* [Single CloudFront distribution with two origins](https://github.com/boushley/awsm-cloudfront)

## License

Licensed under the [MIT License](https://github.com/trendmicro/serverless-survey-forms/blob/master/LICENSE).