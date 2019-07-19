# serverless-survey-forms (still under construction)

[![Serverless Framework](https://camo.githubusercontent.com/547c6da94c16fedb1aa60c9efda858282e22834f/687474703a2f2f7075626c69632e7365727665726c6573732e636f6d2f6261646765732f76332e737667)](http://www.serverless.com/)
[![Build Status](https://travis-ci.org/trendmicro/serverless-survey-forms.svg?branch=master)](https://travis-ci.org/trendmicro/serverless-survey-forms)
[![Coverage Status](https://coveralls.io/repos/github/trendmicro/serverless-survey-forms/badge.svg?branch=master)](https://coveralls.io/github/trendmicro/serverless-survey-forms?branch=master)

To create a google-style survey forms, authorized users could design surveys and collect anonymous feedbacks.

## Architecture Overview

![](http://i.imgur.com/HXk0u6O.png)

## Known Issues

* [issue#1322](https://github.com/serverless/serverless/issues/1322): After executing ```sls project init```, a lot of files are modified.
    * Work around: None.

## Prerequisitions

### Development Environment

This project depends on the following modules, please make sure they're ready after [Installation].

* NodeJS 3.7.3
* serverless 0.5.6

To prevent from poluting your local environment, you may leverage the Vagrant file to isolate your development environment.

### Service FQDN

You have to apply a FQDN first, survey.organization.com, for instance in the following instructions.

## First time deployment

Please refer to [instructions](firsttimedeployment.md) for first time deployment.

## After first deployment

Please refer to [instructions](afterfirstdeployment.md) for later deployment.

## Unit Test

#### Serverless site unit test

The steps below can be taken to verify the functionality.

Enter the serverless-survey-form folder the project was cloned:

```cd serverless-survey-form```

Install npm dependency modules in serverless-survey-form

```npm install```

Verify the functionality before any code commit to Git.

```npm test```


#### Frontend site unit test

Enter the web folder the project was cloned:

```cd web```

Install npm dependency modules in web

```npm install```

Verify the functionality before any code commit to Git.

```npm test```



## License

Licensed under the [MIT License](https://github.com/trendmicro/serverless-survey-forms/blob/master/LICENSE).