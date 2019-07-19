# After first deployment

## Backup your meta file regularly

If you're in charge of deploying Serverless environment, you should backup meta in these two conditions:

* Right after project initialization.
* Everytime you set or unset variables to meta.

## Manipulate to s-resources-cf.json

If you add any new resource, please execute:

```
sls resources deploy -s <stage>
```

## Manipulate to s-function.json

If you add or modify any new API endpoint, please execute:

```
sls endpoint deploy -a -s <stage>
```

## Manipulate to Lambda functions

If you add or modify any new Lambda function, please execute:

```
sls function deploy -s <stage>
```

## Manipulate Static Website Resources 

If you add or modify any static website resources, please execute:

```
bash scripts/qustom_ui_deploy.sh -br <branch> -s <stage>
```
