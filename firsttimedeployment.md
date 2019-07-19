# First time deployment

## Installation

The steps below can be taken to install the project and initialize it.

Open a command line terminal and cd to the location where you will be placing the serverless-survey-forms project.

Clone the project directly from Github:

```
git clone https://github.com/trendmicro/serverless-survey-forms.git
```

Enter the serverless-survey-form folder that was just created:

```
cd serverless-survey-forms
```

Install npm dependency modules in serverless-survey-form:

```
npm install
```

Initialize the project and input your AWS access key and secret key:

```
sls project init
```

Please also name your stage name globally unique due to S3 naming convention and ignore the following possible warning during project initialization:

```
> Serverless: WARNING: This variable is not defined: providerFacebookId  
> Serverless: WARNING: This variable is not defined: providerFacebookSecret  
> Serverless: WARNING: This variable is not defined: tokenSecret  
```

> * [issue#1322](https://github.com/serverless/serverless/issues/1322): 
> After executing ```sls project init```, a lot of files are modified.
> Please revert those changes as work around.

Install npm dependency modules in serverless-survey-form/api:

```
cd api
npm install
cd ..
```

## Authentication Provider Settings

### Facebook App Id Application

Firstly, you have to apply a Facebook App Id for OAuth athentication, please follow steps in [facebook for developer](https://developers.facebook.com/docs/apps/register) to create a **Website** app. 

Please fill ```https://survey.organization.com``` in field **Facebook Login | Valid OAuth redirect URIs**.

Configure Facebook App as authentication provider by executing serverless CLI below:

```
# Setup JWT token secret key
$ sls variables set 
Serverless: Enter variable key to set a value to:  tokenSecret
Serverless: Enter variable value to set a value to:  [your-secret-for-json-web-token]
Serverless: Select variable type: 
    1) Common
    2) Stage
  > 3) Region
Serverless: Successfully set variable: tokenSecret  

# Setup Facebook App Id
$ sls variables set 
Serverless: Enter variable key to set a value to:  providerFacebookId
Serverless: Enter variable value to set a value to:  [your-facebook-app-id]
Serverless: Select variable type: 
    1) Common
    2) Stage
  > 3) Region
Serverless: Successfully set variable: providerFacebookId  

# Setup Facebook App secret
$ sls variables set 
Serverless: Enter variable key to set a value to:  providerFacebookSecret
Serverless: Enter variable value to set a value to:  [your-facebook-app-secret]
Serverless: Select variable type: 
    1) Common
    2) Stage
  > 3) Region
Serverless: Successfully set variable: providerFacebookSecret  

# Setup service FQDN, survey.organization.com, for example
$ sls variables set 
Serverless: Enter variable key to set a value to:  websiteDomainName
Serverless: Enter variable value to set a value to:  [https://survey.organization.com]
Serverless: Select variable type: 
    1) Common
    2) Stage
  > 3) Region
Serverless: Successfully set variable: websiteDomainName

```

Environmental variables are mapped in s-function.json files, for example in the signin/s-function.json.

## Static Website Resources Compilation

```
# go to web folder
cd web
# install npm dependency modules for build script
npm install
# execute deploy script
npm run deploy
```

## Service Deployment

Deploy your functions, endpoints, and web client:

```
# deploy APIGW and Lambda
sls dash deploy
# deploy static web resources
sls client deploy -s [stage]
```

## CloudFront Distribution

After deploying both APIGW and S3, there should be two valid endpoints of them. The further step to unify these two endpoints is critical important. This project leverages CloudFront distribution with two origins, the one is S3 bucket for static website resources, and the another one is API Gateway endpoint.


```
aws cloudformation create-stack \
  --profile [optional credential profile] \
  --stack-name [serverless-survey-forms-stack-name] \
  --template-body file://aws-cloudfront-cf.json \
  --parameters \
    ParameterKey=stage,ParameterValue=[stage] \
    ParameterKey=apigwid,ParameterValue=[apigw Id] \ 
    ParameterKey=region,ParameterValue=[region] \
    ParameterKey=websiteDomainName,ParameterValue=[survey.organization.com]
```

## CloudFront Custom SSL

Custom SSL certificate support lets you deliver content over HTTPS using your own domain name, survey.organization.com, for instance and your own SSL certificate.

Please follow [Using Alternate Domain Names (CNAMEs)](http://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/CNAMEs.html) to complete final step.

## References

* [Serverless Authentication](https://github.com/laardee/serverless-authentication-boilerplate)
* [Introducing custom authorizers in Amazon API Gateway](https://aws.amazon.com/tw/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/)
* [Single CloudFront distribution with two origins](https://github.com/boushley/awsm-cloudfront)
