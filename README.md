# serverless-survey-forms (still under construction)

[![Serverless Framework](https://camo.githubusercontent.com/547c6da94c16fedb1aa60c9efda858282e22834f/687474703a2f2f7075626c69632e7365727665726c6573732e636f6d2f6261646765732f76332e737667)](http://www.serverless.com/)
[![Build Status](https://travis-ci.org/trendmicro/serverless-survey-forms.svg?branch=master)](https://travis-ci.org/trendmicro/serverless-survey-forms)
[![Coverage Status](https://coveralls.io/repos/github/trendmicro/serverless-survey-forms/badge.svg?branch=master)](https://coveralls.io/github/trendmicro/serverless-survey-forms?branch=master)

To create a google-style survey forms, authorized users could design surveys and collect anonymous feedbacks.


## Architecture Overview

![](http://i.imgur.com/HXk0u6O.png)

---
## Prerequisites

### Development Environment

This project depends on the following modules, please make sure they're ready after [Installation].

* NodeJS v8.16.0
* serverless v1.47.0

To prevent from polluting your local environment, you may want run the Docker to isolate your development environment.

### Build Docker Image

If you want to add more packages or modify the version numbers, just edit the Dockfile under the project root.  

```bash
cd serverless-survey-form
sudo docker build -t "qustom-env" .
```

### Service FQDN

You have to apply an FQDN first, survey.organization.com, for instance in the following instructions.

### Prepare for Facebook Login

You need to apply a facebook app first and enable the FB OAuth.

Please visit https://developers.facebook.com/apps/ for more details.

After you create an app in success, you can find FACEBOOK_ID and FACEBOOK_SECRET in the app's main page. Set those as the environment variables.

---

## Deploy to AWS

For the IAM regulation, you need to create an IAM user and generate its AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY. Please set those as the environment variables.

### Deploy the survey-forms stack

First, create below environment variables.

```bash
STAGE=dev
REGION=us-west-2
WEB_DOMAIN=YOUR_FQDN
TOKEN_SECRET=YOUR_SECRET_TOKEN
```

Then use Docker to build and deploy the project to AWS. If this is the first time deploy, it will take time to create the resources.

```bash
sudo docker run \
-e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
-e FACEBOOK_ID=$FACEBOOK_ID -e FACEBOOK_SECRET=$FACEBOOK_SECRET -e TOKEN_SECRET=$TOKEN_SECRET \
-e WEB_DOMAIN=$WEB_DOMAIN -e REGION=$REGION \
-v $WORKSPACE:$WORKSPACE_IN_DOCKER qustom-dev:latest /bin/bash \
-c "cd $WORKSPACE_IN_DOCKER && sls deploy --stage $STAGE"
```

### Deploy the survey-forms UI

```bash
sudo docker run \
-e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
-e FACEBOOK_ID=$FACEBOOK_ID -e FACEBOOK_SECRET=$FACEBOOK_SECRET -e TOKEN_SECRET=$TOKEN_SECRET \
-e WEB_DOMAIN=$WEB_DOMAIN -e REGION=$REGION \
-v $WORKSPACE:$WORKSPACE_IN_DOCKER qustom-dev:latest /bin/bash \
-c "cd $WORKSPACE_IN_DOCKER/web && npm install && npm run deploy && sls client deploy --no-confirm --stage $STAGE"
```
---
## Run unit Test

#### Serverless site unit test

The steps below can be taken to verify the functionality.

```bash
cd serverless-survey-form
WORKSPACE=`pwd`
WORKSPACE_IN_DOCKER=`/serverless-survey-form`
sudo docker run \
-v $WORKSPACE:$WORKSPACE_IN_DOCKER qustom-env:latest /bin/bash \
-c "cd $WORKSPACE_IN_DOCKER && npm install && npm test"
```

You can define your WORKSPACE and WORKSPACE_IN_DOCKER as you want, just make sure WORKSPACE_IN_DOCKER point to the root path of the project.

#### Frontend site unit test

Frontend source code is under `/web` folder.

So far, due to the upgrade of the axios package, the unit test of the frontend is broken. We are now dealing with this issue.

```bash
cd serverless-survey-form
WORKSPACE=`pwd`
WORKSPACE_IN_DOCKER=`/serverless-survey-form`
sudo docker run \
-v $WORKSPACE:$WORKSPACE_IN_DOCKER qustom-env:latest /bin/bash \
-c "cd $WORKSPACE_IN_DOCKER/web && npm install && npm run test"
```
---
## License
Licensed under the [MIT License](https://github.com/trendmicro/serverless-survey-forms/blob/master/LICENSE).