#!/usr/bin/env bash

echo "[INFO] --- Deploy UI ---"

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -br|--branch)
    BRANCH="$2"
    shift # past argument
    ;;
    -s|--stage)
    STAGE="$2"
    shift # past argument
    ;;
    *)
            # unknown option
    ;;
esac
shift # past argument or value
done

if [ -z "$STAGE" ] || [ -z "$BRANCH" ];
  then
    echo "Usage: qustom_ui_deploy -br <branch> -s <stage>"
else
    echo "Deploy branch ${BRANCH} to ${STAGE}"
    # checkout source code
    git checkout $BRANCH
    git pull

    # build web client
    cd ./web
    npm install
    npm run deploy

    # deploy to aws S3
    sls client deploy -s $STAGE
fi